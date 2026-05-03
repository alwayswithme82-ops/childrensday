import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Loading } from './components/shared/Loading';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { BoothWatermark } from './components/shared/BoothWatermark';
import { useBoothMode, useBoothModeEffects } from './hooks/useBoothMode';

const GamePage = lazy(() =>
  import('./pages/GamePage').then(m => ({ default: m.GamePage }))
);
const ResultPage = lazy(() =>
  import('./pages/ResultPage').then(m => ({ default: m.ResultPage }))
);
const LeaderboardPage = lazy(() =>
  import('./pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage }))
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then(m => ({ default: m.AdminPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<Loading />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function AppShell() {
  const isBooth = useBoothMode();
  useBoothModeEffects();
  return (
    <>
      <AnimatedRoutes />
      {isBooth && <BoothWatermark />}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
