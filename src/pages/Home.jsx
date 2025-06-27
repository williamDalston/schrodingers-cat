
// src/pages/Home.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { menuData } from '../data/menuData';

const StyledLink = ({ to, children, primary = false }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      className={`block px-10 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
        primary
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-yellow-400/30'
          : 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
      }`}
    >
      {children}
    </Link>
  </motion.div>
);

const FeaturedDishCard = ({ item }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="bg-green-950/40 p-6 rounded-2xl border border-yellow-400/20 text-center h-full flex flex-col"
  >
    {item.signature && (
      <span className="text-sm font-bold text-cyan-300">⭐ SIGNATURE</span>
    )}
    {item.popular && !item.signature && (
       <span className="text-sm font-bold text-red-400">🔥 POPULAR</span>
    )}
    <h3 className="text-2xl font-bold font-serif text-yellow-300 mt-2 mb-2">{item.name}</h3>
    <p className="text-yellow-100/80 flex-grow mb-4">{item.description}</p>
    <span className="text-xl font-mono text-yellow-400">${item.price.amount.toFixed(2)} {item.price.currency}</span>
  </motion.div>
);

export default function Home() {
  const featuredItems = Object.values(menuData)
    .flatMap(category => category.items)
    .filter(item => item.popular || item.signature)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Schrödinger’s Cat | A Culinary Paradox in Cancún</title>
        <meta name="description" content="Where Georgian soul meets Cancún spirit. Explore a playful and elegant dining experience that balances quantum curiosity with culinary artistry." />
      </Helmet>

      <section className="relative text-white text-center py-32 md:py-48 px-6 min-h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900 to-green-950 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/img/quantum-bg.svg')] opacity-5"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1]}}
          className="relative z-10"
        >
          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-serif mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">A Culinary Paradox</span>
          </motion.h1>

          <p className="text-xl md:text-2xl text-yellow-200/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Where Georgian soul meets Cancún spirit. <br/>An elegant experiment in flavor and uncertainty.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <StyledLink to="/menu" primary>Explore the Menu</StyledLink>
            <StyledLink to="/reservations">Book a Table</StyledLink>
          </div>

          <p className="text-sm text-yellow-400/60 mt-20 italic">
            It's late. Perfect for a quantum leap of faith.
          </p>
        </motion.div>
      </section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold font-serif mb-6 text-yellow-300">Both Tradition &<br/>Experiment in One State</h2>
            <p className="text-lg text-yellow-100/80 leading-loose mb-6">
              Our philosophy is simple: honor the rich, soulful traditions of Georgian cuisine while playfully experimenting with the vibrant ingredients of the Yucatán. Until you taste it, a dish is both classic and novel at the same time.
            </p>
            <p className="text-lg text-yellow-100/80 leading-loose">
              Every plate is an observation. Every bite, a discovery.
            </p>
          </div>
          <motion.div 
            className="flex justify-center items-center"
            initial={{ scale: 0.8, opacity: 0}}
            whileInView={{ scale: 1, opacity: 1, rotate: 360 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
          >
            <span className="text-9xl text-yellow-400/50">⚛️</span>
          </motion.div>
        </div>
      </motion.section>

      <section className="bg-green-950/50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-serif mb-12 text-center text-yellow-300"
          >
            Popular Observations
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map(item => (
              <FeaturedDishCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <StyledLink to="/menu">Observe the Full Menu</StyledLink>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-serif mb-12 text-yellow-300"
          >
            More Than Just a Meal
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-4">🍹</span>
              <h3 className="text-2xl font-bold text-yellow-200 mb-2">Quantum Cocktails</h3>
              <p className="text-yellow-100/80">Sip on concoctions that playfully defy expectation.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-4">🎶</span>
              <h3 className="text-2xl font-bold text-yellow-200 mb-2">Live Music Nights</h3>
              <p className="text-yellow-100/80">Let the waves of sound collapse into a perfect evening.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl mb-4">✨</span>
              <h3 className="text-2xl font-bold text-yellow-200 mb-2">Intimate Atmosphere</h3>
              <p className="text-yellow-100/80">A cozy corner of the universe, perfect for quiet observation.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


