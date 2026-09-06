/**
 * ECO Opening Book & Pedagogical Knowledge Base
 * Maps opening lines and FENs to ECO codes, variations, and Grandmaster strategic explanations.
 */

export const OPENING_CONCEPTS = {
  "Ruy Lopez": {
    family: "Ruy Lopez (Spanish Game)",
    eco: "C60-C99",
    whitePlan: "White pressures the c6 knight which defends the central e5 pawn. White aims to control the center, castle quickly, and prepare a powerful d2-d4 push, often rerouting the knight to d2-f1-g3.",
    blackPlan: "Black seeks to stabilize the e5 outpost, break the pin on the c6 knight (often via ...a6 and ...b5), develop the bishop to e7 or c5, and counter-attack in the center or queenside.",
    keyMoves: {
      "3. Bb5": "Attacks the defender of the e5 pawn (the c6 knight). While 4.Bxc6 followed by 5.Nxe5 doesn't immediately win a pawn due to 5...Qd4!, it exerts persistent positional pressure on Black's central structure.",
      "3... a6": "The Morphy Defense. Immediately challenges White's bishop: 'Declare your intention—trade on c6 or retreat to a4?' If White retreats to a4, Black retains the option of playing ...b5 later to break pins and seize queenside space.",
      "3... Nf6": "The Berlin Defense. Directly counter-attacks White's undefended e4 pawn rather than reacting to the bishop on b5. Often leads to the resilient, endgame-heavy 'Berlin Wall'.",
      "4. Ba4": "Main line retreat. Keeps the pin on the knight and maintains positional tension rather than ceding the bishop pair.",
      "4. Bxc6": "The Exchange Variation. White voluntarily trades the bishop for the knight, damaging Black's pawn structure (doubled c-pawns) with the strategic dream of entering a winning pawn endgame with a 4-vs-3 kingside pawn majority.",
      "4... Nf6": "Continues piece development and attacks the e4 pawn, pressuring White to either castle or defend the center.",
      "5. O-O": "Castling into safety and allowing the e4 pawn to be taken temporarily (5...Nxe4 6.d4 b5 7.Bb3 d5 8.dxe5 Be6 Open Ruy Lopez), because the open e-file creates tactical counterplay against Black's uncastled king."
    }
  },
  "Sicilian Defense": {
    family: "Sicilian Defense",
    eco: "B20-B99",
    whitePlan: "White typically aims for an open game with 2.Nf3 and 3.d4, trading a central d-pawn for Black's c-pawn, gaining space, rapid piece activity, and aggressive kingside attacking chances.",
    blackPlan: "Black fights for the center asymmetrically with ...c5, securing a central pawn majority (d- and e-pawns against White's e-pawn) and an open c-file for queenside counterplay.",
    keyMoves: {
      "1... c5": "Strikes at the central d4 square from the flank. Unlike 1...e5, which creates a symmetrical position, 1...c5 creates an unbalanced dynamic battle where Black plays to win.",
      "2. Nf3": "Prepares the standard central break with 3.d4.",
      "2... d6": "Controls e5 and c5, preparing kingside piece development while guarding against White knight or bishop leaps.",
      "2... Nc6": "Develops a knight toward the center and contests the d4 square directly.",
      "2... e6": "The French-style Sicilian (leading to Taimanov, Kan, or Four Knights), preparing rapid development and central control.",
      "3. d4": "The Open Sicilian. White sacrifices a central pawn for rapid development, open diagonals, and piece mobility.",
      "5... a6": "The Najdorf Variation. A versatile multi-purpose move: prevents White knights from landing on b5, prepares queenside expansion with ...b5, and keeps Black's options open for the kingside."
    }
  },
  "Italian Game": {
    family: "Italian Game (Giuoco Piano)",
    eco: "C50-C54",
    whitePlan: "White targets the vulnerable f7 square (the weakest point in Black's camp, guarded only by the King) with 3.Bc4, while preparing to build a broad pawn center with c3 and d4.",
    blackPlan: "Black develops harmoniously with ...Bc5 or ...Nf6, guarding f7 and challenging White's control of the center.",
    keyMoves: {
      "3. Bc4": "Places the bishop on an active diagonal aiming directly at the sensitive f7 pawn.",
      "3... Bc5": "The Giuoco Piano ('Quiet Game'). Matches White's piece activity, controls d4, and prepares kingside castling.",
      "3... Nf6": "The Two Knights Defense. Immediately counter-attacks White's undefended e4 pawn, leading to sharp tactical skirmishes (such as 4.Ng5 Fried Liver Attack territory).",
      "4. c3": "Prepares to support 5.d4, aiming to establish a classical pawn center with pawns on both e4 and d4."
    }
  },
  "Queen's Gambit": {
    family: "Queen's Gambit",
    eco: "D06-D69",
    whitePlan: "White offers the c4 wing pawn to tempt Black into surrendering the center, aiming to dominate the center with e4, d4, and rapid piece development.",
    blackPlan: "Black either solidly defends the d5 strongpoint with ...e6 (Declined) or ...c6 (Slav), or accepts the pawn with ...dxc4, planning to return it for rapid piece counterplay.",
    keyMoves: {
      "2. c4": "The Queen's Gambit. Not a true sacrifice because White easily recovers the pawn if accepted (e.g. 2...dxc4 3.e3 or 3.Nf3). The goal is to trade a wing pawn for Black's central d5 pawn.",
      "2... e6": "Queen's Gambit Declined (QGD). Solidly reinforces d5. Although it temporarily boxes in Black's light-squared 'problem bishop' on c8, it guarantees a rock-solid central bastion.",
      "2... c6": "The Slav Defense. Reinforces d5 with the c-pawn without blocking the c8 bishop, keeping open options for active piece development.",
      "2... dxc4": "Queen's Gambit Accepted (QGA). Black temporarily takes the pawn, planning to counter White's central space with rapid development like ...Nf6 and ...c5."
    }
  },
  "French Defense": {
    family: "French Defense",
    eco: "C00-C19",
    whitePlan: "White usually pushes e5 to secure a spatial advantage on the kingside, preparing a piece attack against Black's king.",
    blackPlan: "Black constructs a sturdy pawn chain (c7-d5-e6) and attacks the base of White's pawn chain with ...c5 and ...f6, operating on the open c-file.",
    keyMoves: {
      "1... e6": "Prepares to stake a claim in the center with 2...d5 while keeping a solid, defensive posture.",
      "2... d5": "Strikes at White's e4 pawn, establishing a firm pawn foothold in the center.",
      "3. e5": "The Advance Variation. White closes the center, gaining kingside space and restricting Black's knight from using f6."
    }
  },
  "Caro-Kann Defense": {
    family: "Caro-Kann Defense",
    eco: "B10-B19",
    whitePlan: "White seeks central dominance with d4 and e4, or plays 3.e5 (Advance Variation) to cramp Black's camp.",
    blackPlan: "Black prepares ...d5 with ...c6. Unlike the French Defense, Black's light-squared bishop remains free to develop outside the pawn chain to f5 or g4 before ...e6 is played.",
    keyMoves: {
      "1... c6": "Prepares 2...d5 to fight for the center without locking in the light-squared bishop.",
      "2... d5": "Directly confronts White's e4 pawn with a fully supported pawn in the center."
    }
  },
  "King's Indian Defense": {
    family: "King's Indian Defense",
    eco: "E60-E99",
    whitePlan: "White occupies the center with d4, c4, and e4, securing space and preparing a queenside breakthrough via c4-c5.",
    blackPlan: "Black concedes the center initially, fianchettoes the dark-squared bishop with ...g6 and ...Bg7, castles kingside, and unleashes a ferocious kingside attack with ...f5.",
    keyMoves: {
      "1... Nf6": "Hypermodern approach: prevents White from playing 2.e4 immediately while keeping Black's setup flexible.",
      "2... g6": "Prepares the fianchetto of the bishop to g7, placing laser focus on the central dark squares.",
      "3... Bg7": "Completes the fianchetto, exerting long-diagonal pressure down to d4 and b2."
    }
  },
  "London System": {
    family: "London System",
    eco: "D02",
    whitePlan: "White develops the dark-squared bishop outside the pawn chain to f4 before playing e3, creating an impenetrable pyramid of pawns (c3-d4-e3) with harmonious piece coordination.",
    blackPlan: "Black targets White's b2 pawn with ...Qb6, challenges the f4 bishop with ...Bd6, or strikes at the center with ...c5.",
    keyMoves: {
      "2. Bf4": "The hallmark of the London System. The bishop gets developed outside the pawn chain before e3 is played, preventing it from being locked behind pawns."
    }
  }
};

/**
 * Opening lines lookup table: Maps sequence of SAN moves (joined by space) to ECO data.
 */
export const OPENINGS_DB = [
  // Ruy Lopez Variations
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O b5 Bb3 Be7", eco: "C88", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Closed: Anti-Marshall System" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7", eco: "C84", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Closed Defense" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O", eco: "C80", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Morphy Defense: Open / Closed System" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6", eco: "C78", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Morphy Defense: Modern Line" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4", eco: "C70", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Morphy Defense: Columbus / Main Line" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6 dxc6", eco: "C69", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Exchange Variation: Main Line" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Bxc6", eco: "C68", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Exchange Variation" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6", eco: "C65", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Morphy Defense" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4", eco: "C67", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Berlin Defense: Open Line" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 Nf6", eco: "C65", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Berlin Defense (Berlin Wall)" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 f5", eco: "C63", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Schliemann Defense (Jaenisch Gambit)" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 Bc5", eco: "C64", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Classical Defense (Cordel)" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 d6", eco: "C62", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Steinitz Defense" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 g6", eco: "C60", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Fianchetto (Smyslov) Defense" },
  { moves: "e4 e5 Nf3 Nc6 Bb5", eco: "C60", name: "Ruy Lopez", family: "Ruy Lopez", variation: "Spanish Opening" },

  // Italian Game & Scotch
  { moves: "e4 e5 Nf3 Nc6 Bc4 Bc5 c3", eco: "C54", name: "Italian Game", family: "Italian Game", variation: "Giuoco Piano: Main Center Attack" },
  { moves: "e4 e5 Nf3 Nc6 Bc4 Bc5 b4", eco: "C51", name: "Italian Game", family: "Italian Game", variation: "Evans Gambit" },
  { moves: "e4 e5 Nf3 Nc6 Bc4 Bc5", eco: "C53", name: "Italian Game", family: "Italian Game", variation: "Giuoco Piano: Classical" },
  { moves: "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5", eco: "C57", name: "Italian Game", family: "Italian Game", variation: "Two Knights: Fried Liver Attack" },
  { moves: "e4 e5 Nf3 Nc6 Bc4 Nf6", eco: "C55", name: "Italian Game", family: "Italian Game", variation: "Two Knights Defense" },
  { moves: "e4 e5 Nf3 Nc6 Bc4", eco: "C50", name: "Italian Game", family: "Italian Game", variation: "Giuoco Piano" },
  { moves: "e4 e5 Nf3 Nc6 d4", eco: "C44", name: "Scotch Game", family: "Italian Game", variation: "Scotch Opening" },

  // Sicilian Defense
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6", eco: "B90", name: "Sicilian Defense", family: "Sicilian Defense", variation: "Najdorf Variation" },
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6", eco: "B70", name: "Sicilian Defense", family: "Sicilian Defense", variation: "Dragon Variation" },
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6", eco: "B56", name: "Sicilian Defense", family: "Sicilian Defense", variation: "Classical Variation" },
  { moves: "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6", eco: "B41", name: "Sicilian Defense", family: "Sicilian Defense", variation: "Kan Variation" },
  { moves: "e4 c5 Nf3 e6 d4 cxd4 Nxd4", eco: "B40", name: "Sicilian Defense", family: "Sicilian Defense", variation: "French Variation / Paulsen" },
  { moves: "e4 c5 c3", eco: "B22", name: "Sicilian Defense", family: "Sicilian Defense", variation: "Alapin Variation (c3 Sicilian)" },
  { moves: "e4 c5 Nc3", eco: "B23", name: "Sicilian Defense", family: "Sicilian Defense", variation: "Closed Sicilian" },
  { moves: "e4 c5", eco: "B20", name: "Sicilian Defense", family: "Sicilian Defense", variation: "General Line" },

  // French & Caro-Kann
  { moves: "e4 e6 d4 d5 Nc3 Bb4", eco: "C15", name: "French Defense", family: "French Defense", variation: "Winawer Variation" },
  { moves: "e4 e6 d4 d5 Nc3", eco: "C10", name: "French Defense", family: "French Defense", variation: "Paulsen Variation" },
  { moves: "e4 e6 d4 d5 Nd2", eco: "C03", name: "French Defense", family: "French Defense", variation: "Tarrasch Variation" },
  { moves: "e4 e6 d4 d5 e5", eco: "C02", name: "French Defense", family: "French Defense", variation: "Advance Variation" },
  { moves: "e4 e6 d4 d5", eco: "C01", name: "French Defense", family: "French Defense", variation: "Main Line" },
  { moves: "e4 e6", eco: "C00", name: "French Defense", family: "French Defense", variation: "General Line" },
  { moves: "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5", eco: "B18", name: "Caro-Kann Defense", family: "Caro-Kann Defense", variation: "Classical Variation" },
  { moves: "e4 c6 d4 d5 e5", eco: "B12", name: "Caro-Kann Defense", family: "Caro-Kann Defense", variation: "Advance Variation" },
  { moves: "e4 c6 d4 d5", eco: "B12", name: "Caro-Kann Defense", family: "Caro-Kann Defense", variation: "Main Line" },
  { moves: "e4 c6", eco: "B10", name: "Caro-Kann Defense", family: "Caro-Kann Defense", variation: "General Line" },

  // Queen's Pawn & Gambits
  { moves: "d4 d5 c4 e6 Nc3 Nf6 Bg5", eco: "D50", name: "Queen's Gambit Declined", family: "Queen's Gambit", variation: "Modern Orthodox" },
  { moves: "d4 d5 c4 e6", eco: "D30", name: "Queen's Gambit Declined", family: "Queen's Gambit", variation: "Traditional Defense" },
  { moves: "d4 d5 c4 c6", eco: "D10", name: "Slav Defense", family: "Queen's Gambit", variation: "Slav Defense" },
  { moves: "d4 d5 c4 dxc4", eco: "D20", name: "Queen's Gambit Accepted", family: "Queen's Gambit", variation: "Accepted Variation" },
  { moves: "d4 d5 c4", eco: "D06", name: "Queen's Gambit", family: "Queen's Gambit", variation: "General Gambit" },
  { moves: "d4 Nf6 c4 g6 Nc3 Bg7", eco: "E60", name: "King's Indian Defense", family: "King's Indian Defense", variation: "Classical" },
  { moves: "d4 Nf6 c4 e6 Nc3 Bb4", eco: "E20", name: "Nimzo-Indian Defense", family: "Queen's Gambit", variation: "Nimzo-Indian Defense" },
  { moves: "d4 d5 Bf4", eco: "D02", name: "London System", family: "London System", variation: "Mason Variation / Modern London" },
  { moves: "d4 Nf6 Bf4", eco: "A48", name: "London System", family: "London System", variation: "Indian Line" },

  // English & Flanks
  { moves: "c4", eco: "A10", name: "English Opening", family: "English Opening", variation: "Flank Opening" },
  { moves: "Nf3", eco: "A04", name: "Reti Opening", family: "Reti Opening", variation: "King's Knight Opening" }
];

/**
 * Identify the current opening given an array of SAN moves.
 * Prefers exact matches where the game has already completed the opening moves.
 */
export function identifyOpening(sanMoves = []) {
  if (!sanMoves || sanMoves.length === 0) {
    return {
      eco: "A00",
      name: "Starting Position",
      family: "Open Game",
      variation: "Standard Start",
      concepts: null
    };
  }

  const movesStr = sanMoves.join(" ");

  // 1. First priority: Exact match or played sequence starts with opening moves
  for (const op of OPENINGS_DB) {
    if (movesStr === op.moves || movesStr.startsWith(op.moves + " ")) {
      return {
        eco: op.eco,
        name: op.name,
        family: op.family,
        variation: op.variation,
        matchedMoves: op.moves,
        concepts: OPENING_CONCEPTS[op.family] || null
      };
    }
  }

  // 2. Second priority: The game is in the middle of this opening line (opening starts with movesStr)
  for (const op of OPENINGS_DB) {
    if (op.moves.startsWith(movesStr)) {
      return {
        eco: op.eco,
        name: op.name,
        family: op.family,
        variation: op.variation,
        matchedMoves: op.moves,
        concepts: OPENING_CONCEPTS[op.family] || null
      };
    }
  }

  // 3. Fallback based on 1st moves
  const firstMove = sanMoves[0];
  let fallback;
  if (firstMove === "e4") {
    fallback = { eco: "B00", name: "King's Pawn Opening", family: "Open Game", variation: "1.e4" };
  } else if (firstMove === "d4") {
    fallback = { eco: "A40", name: "Queen's Pawn Opening", family: "Queen's Pawn", variation: "1.d4" };
  } else if (firstMove === "c4") {
    fallback = { eco: "A10", name: "English Opening", family: "English Opening", variation: "1.c4" };
  } else if (firstMove === "Nf3") {
    fallback = { eco: "A04", name: "Zukertort / Réti Opening", family: "Reti Opening", variation: "1.Nf3" };
  } else {
    fallback = { eco: "A00", name: "Unorthodox Opening", family: "Flank", variation: firstMove };
  }

  return {
    ...fallback,
    matchedMoves: firstMove,
    concepts: OPENING_CONCEPTS[fallback.family] || null
  };
}