import { Outlet, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewTrip from './pages/NewTrip';
import TripDetail from './pages/TripDetail';
import LiveTracking from './pages/LiveTracking';
import Explore from './pages/Explore';
import Destinations from './pages/Destinations';
import Contact from './pages/Contact';
import MyHotelBookings from './pages/MyHotelBookings';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function LoadingYatra() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yatra-bg">
      <img src="/yatra-logo.svg" alt="" className="w-20 h-20 animate-pulse" />
      <p className="font-display text-3xl font-bold text-yatra-primary mt-4">YATRA</p>
      <p className="text-yatra-secondary font-medium">Your Journey, Your Way</p>
      <p className="text-xs text-yatra-dark/50 mt-4">Loading…</p>
    </div>
  );
}

function Protected({ children }) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <LoadingYatra />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/trips/new"
          element={
            <Protected>
              <NewTrip />
            </Protected>
          }
        />
        <Route
          path="/trips/:id"
          element={
            <Protected>
              <TripDetail />
            </Protected>
          }
        />
        <Route
          path="/hotel-bookings"
          element={
            <Protected>
              <MyHotelBookings />
            </Protected>
          }
        />
        <Route
          path="/my-hotel-bookings"
          element={
            <Protected>
              <MyHotelBookings />
            </Protected>
          }
        />
        <Route
          path="/bookings"
          element={
            <Protected>
              <Bookings />
            </Protected>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <Protected>
              <BookingDetail />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route
          path="/notifications"
          element={
            <Protected>
              <Notifications />
            </Protected>
          }
        />
      </Route>
      <Route
        path="/trips/:id/track"
        element={
          <Protected>
            <LiveTracking />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
