import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logoST.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function LandingNav({ regionData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = regionData?.nav ?? { destinations: 'Destinations', business: 'For businesses', advertise: 'Advertising' };
  const planLabel = regionData?.cta?.plan ?? 'Plan my trip';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#444]/90 backdrop-blur-sm">
      <div className="flex justify-between items-center h-[60px] px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex h-[52px] items-center">
          <img src={logo} alt="Snowtrekk" className="h-full w-auto object-contain p-1" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-8">
          <Link
            to="/destination/1"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] transition-colors duration-200 font-medium"
          >
            {nav.destinations}
          </Link>
          <Link
            to="/stores/register"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] transition-colors duration-200 font-medium"
          >
            {nav.business}
          </Link>
          <Link
            to="/contact"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] transition-colors duration-200 font-medium"
          >
            {nav.advertise}
          </Link>
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/join" className="button hidden sm:flex">
            {planLabel}
          </Link>
          <button
            className="sm:hidden text-[#f3f3f3]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden bg-[#333] flex flex-col px-6 py-4 gap-4">
          <Link
            to="/destination/1"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] font-medium"
            onClick={() => setMobileOpen(false)}
          >
            {nav.destinations}
          </Link>
          <Link
            to="/stores/register"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] font-medium"
            onClick={() => setMobileOpen(false)}
          >
            {nav.business}
          </Link>
          <Link
            to="/contact"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] font-medium"
            onClick={() => setMobileOpen(false)}
          >
            {nav.advertise}
          </Link>
          <Link to="/join" className="button w-full" onClick={() => setMobileOpen(false)}>
            {planLabel}
          </Link>
        </nav>
      )}
    </header>
  );
}
