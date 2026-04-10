import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `nav-link-underline px-2 py-1 ${isActive ? 'text-yatra-primary font-semibold' : 'text-yatra-dark hover:text-yatra-secondary'}`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-yatra-bg/85 border-b border-yatra-primary/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/yatra-logo.svg" alt="YATRA" className="w-10 h-10" />
          <div className="leading-tight">
            <span className="font-display font-bold text-lg text-yatra-dark block">यात्रा</span>
            <span className="font-display font-bold text-xs text-yatra-primary tracking-[0.2em]">
              YATRA
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/explore" className={linkClass}>
            Explore
          </NavLink>
          <NavLink to="/destinations" className={linkClass}>
            Destinations
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                My Trips
              </NavLink>
              <NavLink to="/bookings" className={linkClass}>
                Bookings
              </NavLink>
              <NavLink to="/hotel-bookings" className={linkClass}>
                Hotels & dining
              </NavLink>
              <NavLink to="/my-hotel-bookings" className={linkClass}>
                My Hotel Bookings
              </NavLink>
              <NotificationBell />
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu(!menu)}
                className="flex items-center gap-2 rounded-full border-2 border-yatra-secondary/30 px-3 py-1 hover:border-yatra-primary transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-yatra-primary to-yatra-secondary text-white flex items-center justify-center text-sm font-bold">
                  {(user?.name || 'Y')[0]}
                </span>
                <span className="text-sm font-medium text-yatra-dark max-w-[120px] truncate">
                  {user?.name}
                </span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-yatra border border-yatra-primary/10 py-2 z-50">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-yatra-bg text-sm"
                    onClick={() => {
                      setMenu(false);
                      navigate('/profile');
                    }}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-yatra-bg text-sm"
                    onClick={() => {
                      setMenu(false);
                      navigate('/profile?tab=history');
                    }}
                  >
                    History
                  </button>
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-yatra-bg text-sm text-yatra-danger"
                    onClick={() => {
                      setMenu(false);
                      logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-yatra-secondary font-semibold text-sm hover:text-yatra-primary"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-yatra-primary text-sm !py-2 !px-4 inline-block"
              >
                Start YATRA
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-yatra-dark"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-yatra-primary/10 bg-yatra-bg px-4 py-4 flex flex-col gap-3">
          <NavLink to="/explore" onClick={() => setOpen(false)} className="font-medium">
            Explore
          </NavLink>
          <NavLink to="/destinations" onClick={() => setOpen(false)}>
            Destinations
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>
                My Trips
              </NavLink>
              <NavLink to="/bookings" onClick={() => setOpen(false)}>
                Bookings
              </NavLink>
              <NavLink to="/hotel-bookings" onClick={() => setOpen(false)}>
                Hotels & dining
              </NavLink>
              <NavLink to="/notifications" onClick={() => setOpen(false)}>
                Notifications
              </NavLink>
              <NavLink to="/profile" onClick={() => setOpen(false)}>
                Profile
              </NavLink>
              <button type="button" onClick={() => { logout(); setOpen(false); navigate('/'); }}>
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
