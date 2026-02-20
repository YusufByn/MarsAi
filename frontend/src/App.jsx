import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// -- Pages publiques --
const HomePage             = lazy(() => import('./pages/HomePage'));
const Login                = lazy(() => import('./pages/auth/Login'));
const Register             = lazy(() => import('./pages/auth/Register'));
const CGU                  = lazy(() => import('./pages/CGU'));
const AllJury              = lazy(() => import('./pages/user/AllJury'));
const JuryDetails          = lazy(() => import('./pages/user/JuryDetails'));
const FormDirector         = lazy(() => import('./pages/user/FormDirector'));
const ValidatedParticipation = lazy(() => import('./components/Form/ValidatedParticipation'));

// -- Pages nécessitant un compte --
const Videos               = lazy(() => import('./pages/Videos'));
const VideoDetails         = lazy(() => import('./pages/VideoDetails'));
const EditVideo            = lazy(() => import('./pages/EditVideo'));

// -- Pages réservées jury / selector / admin --
const Player               = lazy(() => import('./pages/playerVideo/player'));
const Selector             = lazy(() => import('./pages/selector/selector'));

// -- Pages admin --
const AdminLayout          = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboard       = lazy(() => import('./pages/admin/admin.dashboard'));
const AdminFilms           = lazy(() => import('./pages/admin/admin.films'));
const AdminJury            = lazy(() => import('./pages/admin/admin.jury'));
const AdminEvents          = lazy(() => import('./pages/admin/admin.events'));
const AdminConfig          = lazy(() => import('./pages/admin/admin.config'));
const NewsletterAdmin      = lazy(() => import('./pages/admin/NewsletterAdmin'));
const AdminUsers           = lazy(() => import('./pages/admin/admin.users'));
const AdminMonitoring      = lazy(() => import('./pages/admin/AdminMonitoring'));

const ROLES_AUTHENTICATED  = ['jury', 'selector', 'admin', 'superadmin'];
const ROLES_PLAYER         = ['jury', 'selector', 'admin', 'superadmin'];
const ROLES_ADMIN          = ['admin', 'superadmin'];

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-pulse text-white/30 text-sm">Chargement...</div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isPlayerPage = location.pathname === '/video/player';
  const isAdminPage  = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {!isPlayerPage && !isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ── Public ─────────────────────────────────────────── */}
            <Route path="/"                       element={<HomePage />} />
            <Route path="/login"                  element={<Login />} />
            <Route path="/register"               element={<Register />} />
            <Route path="/mentions"               element={<CGU />} />
            <Route path="/jury"                   element={<AllJury />} />
            <Route path="/jury/profil/:id"        element={<JuryDetails />} />
            <Route path="/formsubmission"         element={<FormDirector />} />
            <Route path="/validatedparticipation" element={<ValidatedParticipation />} />

            {/* ── Compte requis ───────────────────────────────────── */}
            <Route path="/videos" element={
              <ProtectedRoute allowedRoles={ROLES_AUTHENTICATED}>
                <Videos />
              </ProtectedRoute>
            } />
            <Route path="/videoDetails/:id" element={
              <ProtectedRoute allowedRoles={ROLES_AUTHENTICATED}>
                <VideoDetails />
              </ProtectedRoute>
            } />
            <Route path="/video/edit/:id" element={
              <ProtectedRoute allowedRoles={ROLES_AUTHENTICATED}>
                <EditVideo />
              </ProtectedRoute>
            } />

            {/* ── Jury / Selector / Admin ─────────────────────────── */}
            <Route path="/video/player" element={
              <ProtectedRoute allowedRoles={ROLES_PLAYER}>
                <Player />
              </ProtectedRoute>
            } />
            <Route path="/selector" element={
              <ProtectedRoute allowedRoles={ROLES_PLAYER}>
                <Selector />
              </ProtectedRoute>
            } />

            {/* ── Admin ───────────────────────────────────────────── */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={ROLES_ADMIN}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard"   element={<AdminDashboard />} />
              <Route path="films"       element={<AdminFilms />} />
              <Route path="jury"        element={<AdminJury />} />
              <Route path="events"      element={<AdminEvents />} />
              <Route path="config"      element={<AdminConfig />} />
              <Route path="newsletter"  element={<NewsletterAdmin />} />
              <Route path="users"       element={<AdminUsers />} />
              <Route path="monitoring"  element={<AdminMonitoring />} />
            </Route>

          </Routes>
        </Suspense>
      </main>
      {!isPlayerPage && !isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
