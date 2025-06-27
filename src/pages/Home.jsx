// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { menuData } from '../data/menuData';
import catImg from '../assets/cat.jpg';



const StyledLink = ({ to, children, primary = false, className = "" }) => (
  <motion.div 
    whileHover={{ scale: 1.05, rotateX: 5 }} 
    whileTap={{ scale: 0.95 }}
    className="group"
  >
    <Link
      to={to}
      className={`block px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 transform perspective-1000 ${
        primary
          ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black hover:shadow-yellow-400/40 hover:shadow-2xl'
          : 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black backdrop-blur-sm bg-black/20'
      } ${className}`}
    >
      <span className="flex items-center justify-center gap-2">
        {children}
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
          className="transition-transform duration-200"
        >
          →
        </motion.span>
      </span>
    </Link>
  </motion.div>
);

const FeaturedDishCard = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateY: -15 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    whileHover={{ 
      y: -10, 
      scale: 1.02,
      rotateX: 5,
      transition: { type: "spring", stiffness: 300 }
    }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ 
      duration: 0.7, 
      ease: "easeOut",
      delay: index * 0.1
    }}
    className="bg-gradient-to-br from-green-950/60 to-green-900/40 p-8 rounded-2xl border border-yellow-400/30 text-center h-full flex flex-col backdrop-blur-sm shadow-xl hover:shadow-yellow-400/20 hover:shadow-2xl cursor-pointer group"
  >
    <div className="relative mb-4">
      {item.signature && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          className="inline-block text-sm font-bold text-cyan-300 bg-cyan-300/20 px-3 py-1 rounded-full border border-cyan-300/30"
        >
          ⭐ SIGNATURE
        </motion.span>
      )}
      {item.popular && !item.signature && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
          className="inline-block text-sm font-bold text-red-400 bg-red-400/20 px-3 py-1 rounded-full border border-red-400/30"
        >
          🔥 POPULAR
        </motion.span>
      )}
    </div>
    
    <h3 className="text-2xl font-bold font-serif text-yellow-300 mt-2 mb-3 group-hover:text-yellow-200 transition-colors">
      {item.name}
    </h3>
    <p className="text-yellow-100/80 flex-grow mb-6 leading-relaxed">
      {item.description}
    </p>
    
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-lg py-2 px-4 border border-yellow-400/30"
    >
      <span className="text-xl font-mono text-yellow-400 font-bold">
        ${item.price.amount.toFixed(2)} {item.price.currency}
      </span>
    </motion.div>
  </motion.div>
);

const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
    initial={{ 
      x: Math.random() * window.innerWidth, 
      y: window.innerHeight + 100,
      opacity: 0 
    }}
    animate={{
      y: -100,
      opacity: [0, 1, 1, 0],
      x: Math.random() * window.innerWidth,
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  
  return (
    <>
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-b from-green-900 via-green-950 to-black opacity-90"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]"
      />
    </>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.8]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const featuredItems = Object.values(menuData)
    .flatMap(category => category.items)
    .filter(item => item.popular || item.signature)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Schrödinger's Cat | A Culinary Paradox in Cancún</title>
        <meta name="description" content="Where Georgian soul meets Cancún spirit. Explore a playful and elegant dining experience that balances quantum curiosity with culinary artistry." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative text-white text-center py-32 md:py-48 px-6 min-h-screen flex flex-col justify-center items-center overflow-hidden">
        <ParallaxBackground />
        
        {/* Floating Particles */}
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} />
        ))}

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-6xl mx-auto"
        >
      {/* Background Cat */}
        <motion.img
            src={catImg}
            alt="Schrödinger's Cat"
            className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
                width: '90%',
                height: '90%',
            }}
            initial={{ opacity: 0, scale: 3 }}
            animate={{ opacity: .3, scale: 5 }}
            transition={{ delay: 0.5, duration: 2 }}
        />



          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-serif mb-6"
          >
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
              A Culinary Paradox
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-yellow-200/90 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Where Georgian soul meets Cancún spirit. <br/>
            <span className="text-cyan-300 font-semibold">An elegant experiment in flavor and uncertainty.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
          >
            <StyledLink to="/menu" primary>Explore the Menu</StyledLink>
            <StyledLink to="/reservations">Book a Table</StyledLink>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-sm text-yellow-400/60 italic"
          >
            "It's late. Perfect for a quantum leap of faith."
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-yellow-400/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-yellow-400/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-200px" }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 bg-gradient-to-b from-transparent to-green-950/30"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-yellow-300 leading-tight">
              Both Tradition &<br/>
              <span className="text-cyan-300">Experiment</span> in One State
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-yellow-100/80 leading-loose">
                Our philosophy is simple: honor the rich, soulful traditions of Georgian cuisine while playfully experimenting with the vibrant ingredients of the Yucatán.
              </p>
              <p className="text-lg text-yellow-100/80 leading-loose font-medium">
                Until you taste it, a dish is both classic and novel at the same time.
              </p>
              <p className="text-xl text-cyan-300 font-serif italic">
                "Every plate is an observation. Every bite, a discovery."
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center items-center relative"
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 15 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
          >
            <div className="relative">
              <motion.span 
                className="text-9xl md:text-[12rem] text-yellow-400/60"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                ⚛️
              </motion.span>
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-cyan-400/20 blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Items Section */}
      <section className="bg-gradient-to-b from-green-950/30 via-green-950/50 to-green-950/30 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.05),transparent_70%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-yellow-300">
              Popular Observations
            </h2>
            <p className="text-lg text-yellow-100/70 max-w-2xl mx-auto">
              These quantum culinary experiments have collapsed into our most celebrated dishes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredItems.map((item, index) => (
              <FeaturedDishCard key={item.id} item={item} index={index} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <StyledLink to="/menu" className="text-lg px-12 py-5">
              Observe the Full Menu
            </StyledLink>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-serif mb-16 text-yellow-300"
          >
            More Than Just a Meal
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: "🍹",
                title: "Quantum Cocktails",
                description: "Sip on concoctions that playfully defy expectation and collapse probability into perfect flavor.",
                delay: 0
              },
              {
                icon: "🎶", 
                title: "Live Music Nights",
                description: "Let the waves of sound collapse into a perfect evening of culinary and auditory harmony.",
                delay: 0.2
              },
              {
                icon: "✨",
                title: "Intimate Atmosphere", 
                description: "A cozy corner of the universe, perfect for quiet observation and meaningful connections.",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <motion.span 
                  className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.span>
                <h3 className="text-2xl font-bold text-yellow-200 mb-4 group-hover:text-yellow-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-yellow-100/80 leading-relaxed max-w-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}