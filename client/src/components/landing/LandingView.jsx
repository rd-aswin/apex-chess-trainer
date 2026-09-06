import React, { useState, useEffect } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingFooter } from './LandingFooter';

// The 19 Page Components
import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { ByokGuidePage } from './pages/ByokGuidePage';
import { VsChesscomPage } from './pages/VsChesscomPage';
import { VsLichessPage } from './pages/VsLichessPage';
import { FeatureAiReviewPage } from './pages/FeatureAiReviewPage';
import { FeatureSocraticPage } from './pages/FeatureSocraticPage';
import { FeatureLeakDetectionPage } from './pages/FeatureLeakDetectionPage';
import { FeatureEnginePage } from './pages/FeatureEnginePage';
import { FeatureDrillsPage } from './pages/FeatureDrillsPage';
import { FeatureOpeningsPage } from './pages/FeatureOpeningsPage';
import { UseCaseBeginnerPage } from './pages/UseCaseBeginnerPage';
import { UseCaseClubPage } from './pages/UseCaseClubPage';
import { UseCaseAdultPage } from './pages/UseCaseAdultPage';
import { UseCaseCoachesPage } from './pages/UseCaseCoachesPage';
import { ManifestoPage } from './pages/ManifestoPage';
import { RoiCalculatorPage } from './pages/RoiCalculatorPage';
import { InteractiveDemoPage } from './pages/InteractiveDemoPage';
import { FaqPrivacyPage } from './pages/FaqPrivacyPage';

export function LandingView({ onLaunchApp, initialPage = 'home' }) {
  const [currentPage, setCurrentPage] = useState(() => {
    // Check URL hash if present (e.g. #pricing, #calculator, #features/ai-review)
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || initialPage;
  });

  // Sync with browser back/forward buttons and hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = `#${pageId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the requested page component
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'pricing':
        return <PricingPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'how-byok-works':
        return <ByokGuidePage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'vs-chesscom':
        return <VsChesscomPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'vs-lichess':
        return <VsLichessPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'features/ai-review':
        return <FeatureAiReviewPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'features/socratic-sparring':
        return <FeatureSocraticPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'features/leak-detection':
        return <FeatureLeakDetectionPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'features/engine':
        return <FeatureEnginePage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'features/drills':
        return <FeatureDrillsPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'features/openings':
        return <FeatureOpeningsPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'use-cases/1200-1500':
        return <UseCaseBeginnerPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'use-cases/1600-1900':
        return <UseCaseClubPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'use-cases/adult-improver':
        return <UseCaseAdultPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'use-cases/coaches':
        return <UseCaseCoachesPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'manifesto':
        return <ManifestoPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'calculator':
        return <RoiCalculatorPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'demo':
        return <InteractiveDemoPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      case 'faq-privacy':
        return <FaqPrivacyPage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
      default:
        return <HomePage onNavigate={navigateTo} onLaunchApp={onLaunchApp} />;
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      <LandingNavbar 
        currentPage={currentPage} 
        onNavigate={navigateTo} 
        onLaunchApp={onLaunchApp} 
      />
      
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <LandingFooter 
        onNavigate={navigateTo} 
        onLaunchApp={onLaunchApp} 
      />
    </div>
  );
}
