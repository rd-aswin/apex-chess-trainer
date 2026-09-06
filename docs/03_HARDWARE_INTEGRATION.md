# 03. Hardware Integration & Acceleration Guide

---

## 1. Verified Host Machine Specification

The application is tailored specifically for the host hardware discovered during system diagnostics:

| Property | Value / Specification |
| :--- | :--- |
| **Manufacturer & Model** | Lenovo ThinkPad E16 Gen 3 |
| **Operating System** | Windows 11 Home (Build 26100 / Version 24H2) |
| **Processor (CPU)** | AMD Ryzen 7 250 (Zen 4 Architecture) |
| **Cores / Threads** | 8 Physical Cores / 16 Logical Processors (Up to 5.1 GHz) |
| **Vector Instruction Sets** | **AVX-512**, **AVX2**, **BMI2**, **FMA3**, **SHA** |
| **System Memory (RAM)** | 16.0 GB DDR5 High-Bandwidth Unified Memory |
| **Integrated Graphics (iGPU)**| AMD Radeon 780M Graphics (RDNA 3, 12 CUs, DirectML support) |
| **Neural Processing Unit (NPU)**| **AMD NPU Compute Accelerator Device** (`PCI\VEN_1022&DEV_1502`)<br>• Driver: AMD Version `32.0.203.329`<br>• Architecture: AMD XDNA (Ryzen AI) |

---

## 2. Hardware Resource Allocation Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                      HARDWARE WORKLOAD MAPPING                         │
├──────────────────────┬─────────────────────────────────────────────────┤
│ AMD Ryzen 7 250 CPU  │ Stockfish 19 Engine (Pure Alpha-Beta Search)    │
│ (AVX-512 SIMD)       │ • 8 to 16 threads dedicated to tree search      │
│                      │ • 8,000,000 to 12,000,000 nodes/sec             │
├──────────────────────┼─────────────────────────────────────────────────┤
│ AMD XDNA NPU         │ Local AI Coach Model (Quantized INT4 Inference) │
│ (Ryzen AI Engine)    │ • Runs via ONNX Runtime / DirectML              │
│                      │ • Generates coaching explanations at <5W power  │
├──────────────────────┼─────────────────────────────────────────────────┤
│ AMD Radeon 780M GPU  │ Graphics & Tensor Acceleration                  │
│ (RDNA 3 Engine)      │ • Hardware-accelerated SVG board rendering      │
│                      │ • Fallback/Hybrid acceleration for AI models    │
├──────────────────────┼─────────────────────────────────────────────────┤
│ 16 GB DDR5 RAM       │ Memory Budgeting                                │
│                      │ • Stockfish Hash Table: 256MB to 1024MB         │
│                      │ • Quantized Model Cache: ~1.5GB to 2.0GB        │
│                      │ • Free RAM remaining: 12GB+                     │
└──────────────────────┴─────────────────────────────────────────────────┘
```

---

## 3. Why Stockfish Must Run on the CPU (Computer Science Deep Dive)

It is common to ask why Stockfish does not run on the NPU or GPU.

1. **The Nature of Alpha-Beta Search**:
   * Stockfish evaluates between **5,000,000 and 12,000,000 board positions every second**.
   * Each position evaluation using NNUE takes only **50 to 80 nanoseconds**.
2. **The PCIe / System Bus Latency Barrier**:
   * Sending a batch of data to a GPU or NPU over a PCIe or internal bus incurs a minimum roundtrip latency of **5 to 20 microseconds (5,000 to 20,000 nanoseconds)**.
   * If Stockfish had to wait for bus transfers at every branch of its search tree, its calculation speed would collapse by over **200x**.
3. **The CPU Advantage**:
   * Stockfish NNUE resides entirely inside the **L1 and L2 CPU cache** of your Ryzen 7 processor.
   * By utilizing **AVX-512 512-bit vector registers**, a single CPU instruction evaluates multiple piece-square weights simultaneously with zero bus latency.

---

## 4. How the NPU (AMD XDNA) Is Utilized

The NPU is a specialized matrix-multiplication processor designed for sustained, low-power tensor math. We leverage it for the **"Why Was It a Mistake?" Explainer**:

1. **The Execution Provider**:
   * We target the NPU using **ONNX Runtime with Microsoft DirectML (`DmlExecutionProvider`)** or **AMD Vitis AI Execution Provider**.
2. **Zero CPU Contention**:
   * When you finish a match, the AI coach analyzes your blunders using the NPU.
   * Because the NPU has its own dedicated silicon, your CPU cores remain completely idle, your fans stay quiet, and your laptop remains responsive.
3. **Quantized Footprint**:
   * Using **INT4 (4-bit integer) quantization**, high-quality models (such as Llama-3.2-3B or Qwen-2.5-3B) fit inside a compact 1.8 GB memory footprint, running at high tokens-per-second with zero cloud dependencies.
