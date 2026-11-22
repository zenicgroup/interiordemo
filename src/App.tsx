import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { EDITORIAL_EASE } from './components/EditorialMotion';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { StudioProvider } from './context/StudioContext';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ContactPage } from './pages/ContactPage';
import { DesignProcessPage } from './pages/DesignProcessPage';
import { HomePage } from './pages/HomePage';
import { JournalDetailPage } from './pages/JournalDetailPage';
import { JournalPage } from './pages/JournalPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ServicePillarPage } from './pages/ServicePillarPage';
import { ServicesOverviewPage } from './pages/ServicesOverviewPage';
import { StartProjectPage } from './pages/StartProjectPage';
import { TeamPage } from './pages/TeamPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#252521]">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/services" element={<ServicesOverviewPage />} />
              <Route path="/services/residential" element={<ServicePillarPage kind="residential" />} />
              <Route path="/services/commercial" element={<ServicePillarPage kind="commercial" />} />
              <Route path="/services/architecture" element={<ServicePillarPage kind="architecture" />} />
              <Route path="/services/turnkey" element={<ServicePillarPage kind="turnkey" />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/process" element={<DesignProcessPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/:slug" element={<JournalDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/start-project" element={<StartProjectPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StudioProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </StudioProvider>
    </MotionConfig>
  );
}
