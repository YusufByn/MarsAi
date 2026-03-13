import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

// Public pages
const HomePage           = lazy(() => import('./pages/home/HomePage'));
const AllJury            = lazy(() => import('./pages/user/AllJury'));
const JuryDetails        = lazy(() => import('./pages/user/JuryDetails'));
const Player             = lazy(() => import('./pages/playerVideo/player'));
const Login              = lazy(() => import('./pages/auth/Login'));
const Register           = lazy(() => import('./pages/auth/Register'));
const FormDirector       = lazy(() => import('./pages/user/FormDirector'));
const EditVideo          = lazy(() => import('./pages/EditVideo'));
const Selector           = lazy(() => import('./pages/selector/selector'));
const Videos             = lazy(() => import('./pages/Videos'));
const VideoDetails       = lazy(() => import('./pages/VideoDetails'));
const CGU                = lazy(() => import('./pages/CGU'));
const EventsPage         = lazy(() => import('./pages/events/EventsPage'));
const EventDetailPage    = lazy(() => import('./pages/events/EventDetailPage'));
const SponsorsPage       = lazy(() => import('./pages/sponsors/Sponsors'));
const ValidatedParticipation = lazy(() => import('./components/Form/ValidatedParticipation'));

// Admin pages
const AdminDashboard  = lazy(() => import('./pages/admin/admin.dashboard'));
const AdminFilms      = lazy(() => import('./pages/admin/admin.films'));
const AdminJury       = lazy(() => import('./pages/admin/admin.jury'));
const AdminEvents     = lazy(() => import('./pages/admin/admin.events'));
const AdminEvenEdit   = lazy(() => import('./pages/admin/admin.eventEdit'));
const AdminConfig     = lazy(() => import('./pages/admin/admin.config'));
const NewsletterAdmin = lazy(() => import('./pages/admin/NewsletterAdmin'));
const AdminUsers      = lazy(() => import('./pages/admin/admin.users'));
const AdminMonitoring = lazy(() => import('./pages/admin/AdminMonitoring'));
const AdminSponsors   = lazy(() => import('./pages/admin/admin.sponsors'));

const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

function AppContent() {
  const location = useLocation();
  const isPlayerPage = location.pathname === '/video/player';
  const isAdminPage  = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <ScrollToTop />
      {!isPlayerPage && !isAdminPage && <Navbar />}
      <main className={`flex-grow ${!isPlayerPage && !isAdminPage ? 'pt-20' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/jury" element={<AllJury />} />
            <Route path="/jury/profil/:id" element={<JuryDetails />} />
            <Route path="/video/player" element={<Player />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/formsubmission" element={<FormDirector />} />
            <Route path="/video/edit/:id" element={<EditVideo />} />
            <Route path="/selector" element={<Selector />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videoDetails/:id" element={<VideoDetails />} />
            <Route path="/mentions" element={<CGU />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/sponsors" element={<SponsorsPage />} />
            <Route path="/validatedparticipation" element={<ValidatedParticipation />} />
            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="films" element={<AdminFilms />} />
              <Route path="jury" element={<AdminJury />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/edit/:id" element={<AdminEvenEdit />} />
              <Route path="config" element={<AdminConfig />} />
              <Route path="newsletter" element={<NewsletterAdmin />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="monitoring" element={<AdminMonitoring />} />
              <Route path="sponsors" element={<AdminSponsors />} />
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
