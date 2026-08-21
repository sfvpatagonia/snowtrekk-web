import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '@/assets/logoST.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DrawerGuide from '@/components/DrawerGuide.jsx';
import { fetchDestinations } from '@/redux/destinationSlice';
import { fetchAreas } from '@/redux/areaSlice';
import { fetchCities } from '@/redux/citySlice';
import { fetchRegions } from '@/redux/regionSlice';
import { fetchActivities } from '@/redux/activitySlice';
import { fetchCountries } from '@/redux/countrySlice.js';

export default function LandingNav({ regionData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);
  const nav = regionData?.nav ?? { destinations: 'Destinations', business: 'For businesses', advertise: 'Advertising' };
  const planLabel = regionData?.cta?.plan ?? 'Plan my trip';

  const dispatch = useDispatch();
  const countryStatus = useSelector((state) => state.countries.status);
  const destinationStatus = useSelector((state) => state.destinations.status);
  const cityStatus = useSelector((state) => state.cities.status);
  const areaStatus = useSelector((state) => state.areas.status);
  const regionStatus = useSelector((state) => state.regions.status);
  const activityStatus = useSelector((state) => state.activities.status);

  // Same fetch-if-idle pattern as Header.jsx — needed here too because the
  // Landing page renders LandingNav instead of Header, so nothing else
  // populates these slices before DrawerGuide needs them.
  useEffect(() => {
    const states = [
      { status: countryStatus, thunk: fetchCountries },
      { status: destinationStatus, thunk: fetchDestinations },
      { status: cityStatus, thunk: fetchCities },
      { status: areaStatus, thunk: fetchAreas },
      { status: regionStatus, thunk: fetchRegions },
      { status: activityStatus, thunk: fetchActivities },
    ];

    states.forEach(({ status, thunk }) => {
      if (status === 'idle') {
        dispatch(thunk());
      }
    });
  }, [
    dispatch,
    countryStatus,
    destinationStatus,
    cityStatus,
    areaStatus,
    regionStatus,
    activityStatus,
  ]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#444]/90 backdrop-blur-sm">
      <div className="flex justify-between items-center h-[60px] px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex h-[52px] items-center">
          <img src={logo} alt="Snowtrekk" className="h-full w-auto object-contain p-1" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-8">
          <button
            type="button"
            onClick={() => setOpenGuide(true)}
            className="text-[#f3f3f3] hover:text-[var(--color-500)] transition-colors duration-200 font-medium"
          >
            {nav.destinations}
          </button>
          <Link
            to="/stores/register"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] transition-colors duration-200 font-medium"
          >
            {nav.business}
          </Link>
          {/* "Publicidad" hidden — no advertising page exists yet, /contact 404s */}
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
          <button
            type="button"
            className="text-left text-[#f3f3f3] hover:text-[var(--color-500)] font-medium"
            onClick={() => {
              setMobileOpen(false);
              setOpenGuide(true);
            }}
          >
            {nav.destinations}
          </button>
          <Link
            to="/stores/register"
            className="text-[#f3f3f3] hover:text-[var(--color-500)] font-medium"
            onClick={() => setMobileOpen(false)}
          >
            {nav.business}
          </Link>
          {/* "Publicidad" hidden — no advertising page exists yet, /contact 404s */}
          <Link to="/join" className="button w-full" onClick={() => setMobileOpen(false)}>
            {planLabel}
          </Link>
        </nav>
      )}
      {openGuide && <DrawerGuide open={openGuide} setOpen={setOpenGuide} />}
    </header>
  );
}
