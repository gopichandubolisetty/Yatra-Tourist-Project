import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-yatra-dark text-yatra-bg/90 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src="/yatra-logo.svg" alt="" className="w-10 h-10" />
            <div>
              <p className="font-display font-bold text-xl text-white">यात्रा</p>
              <p className="font-display font-bold text-yatra-primary tracking-widest">YATRA</p>
            </div>
          </div>
          <p className="text-sm text-yatra-accent/90">Your Journey, Your Way</p>
        </div>
        <div>
          <h3 className="font-display text-white font-semibold mb-3">YATRA</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-yatra-primary transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-yatra-primary transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-yatra-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="text-yatra-accent mb-2">Built with ❤️ at VIT-AP University</p>
          <p className="text-white/80 mb-1 font-semibold">Team YATRA</p>
          <ul className="text-yatra-bg/70 space-y-1">
            <li>S. Ganesh Sai</li>
            <li>SK. Jaheer</li>
            <li>B. Gopi Chandu</li>
            <li>K. Sarat</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-4 text-xs text-yatra-bg/60">
        Copyright © 2026 Yatra. All rights reserved.
      </div>
    </footer>
  );
}
