// App.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

// Lazy-load pages
const Home = React.lazy(() => import('./pages/Home'));
const Menu = React.lazy(() => import('./pages/Menu'));
const Events = React.lazy(() => import('./pages/Events'));
const Reservations = React.lazy(() => import('./pages/Reservations'));
const Contact = React.lazy(() => import('./pages/Contact'));

const navLinks = [
  { path: '/', label: 'Home', component: Home, icon: '🏠' },
  { path: '/menu', label: 'Menu', component: Menu, icon: '📜' },
  { path: '/events', label: 'Events', component: Events, icon: '🎭' },
  { path: '/reservations', label: 'Reservations', component: Reservations, icon: '📅' },
  { path: '/contact', label: 'Contact', component: Contact, icon: '📞' },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, -150]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      style={{ y: headerY }}
      className="sticky top-0 z-50 bg-green-950/90 backdrop-blur-lg border-b border-yellow-400/20"
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <NavLink to="/" className="font-serif font-extrabold text-2xl text-yellow-300">
          🐱 Schrödinger's Cat
        </NavLink>
        <nav className="hidden md:flex items-center space-x-6 text-lg">
          {navLinks.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg font-semibold transition-all ${
                  isActive ? 'bg-yellow-400/10 text-yellow-300' : 'text-yellow-400 hover:text-white'
                }`
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          className="md:hidden text-yellow-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden bg-green-950 px-4 pb-4"
          >
            <nav className="flex flex-col space-y-2">
              {navLinks.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className="text-yellow-400 text-xl"
                >
                  {icon} {label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {navLinks.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Component />
              </motion.div>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-green-950/90 border-t border-yellow-400/20 text-center text-yellow-400 py-6 mt-12">
      <p className="text-sm">© {year} Schrödinger's Cat – Crafted in Tbilisi</p>
    </footer>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-950 via-green-900 to-green-950 text-yellow-400">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<div className="text-center py-20">Loading quantum reality...</div>}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}
