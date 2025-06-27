import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// --- Enhanced Reusable Components ---

const ContactCard = ({ icon, title, children, delay, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, rotateY: 5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-gradient-to-br from-green-950/60 to-green-900/40 p-6 rounded-3xl border border-yellow-400/30 backdrop-blur-lg shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 overflow-hidden ${className}`}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-full blur-3xl" />
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <motion.span 
            className="text-4xl mr-4 text-yellow-400"
            animate={{ rotateY: isHovered ? 180 : 0 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.span>
          <h3 className="text-xl font-bold text-yellow-300 font-serif">{title}</h3>
        </div>
        <div className="text-yellow-100/90 leading-relaxed pl-14 space-y-2">{children}</div>
      </div>
      
      {/* Glowing border effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-yellow-400/0"
        animate={{ borderColor: isHovered ? 'rgba(250, 204, 21, 0.4)' : 'rgba(250, 204, 21, 0)' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const FormField = ({ id, label, type = 'text', value, onChange, placeholder, error, children, icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <label htmlFor={id} className="block text-yellow-300 mb-3 font-semibold text-sm uppercase tracking-wider">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        {children ? (
          React.cloneElement(children, {
            id,
            value,
            onChange,
            placeholder,
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            className: `w-full px-6 py-4 bg-black/50 border-2 rounded-2xl text-yellow-100 placeholder-yellow-400/60 focus:outline-none transition-all duration-500 backdrop-blur-sm ${
              error ? 'border-red-500/80 focus:ring-4 focus:ring-red-500/30' : 
              isFocused ? 'border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 shadow-lg shadow-yellow-400/10' : 
              'border-yellow-400/40 hover:border-yellow-400/60'
            }`
          })
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-6 py-4 bg-black/50 border-2 rounded-2xl text-yellow-100 placeholder-yellow-400/60 focus:outline-none transition-all duration-500 backdrop-blur-sm ${
              error ? 'border-red-500/80 focus:ring-4 focus:ring-red-500/30' : 
              isFocused ? 'border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 shadow-lg shadow-yellow-400/10' : 
              'border-yellow-400/40 hover:border-yellow-400/60'
            }`}
          />
        )}
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-yellow-400/0 pointer-events-none"
          animate={{ 
            borderColor: isFocused ? 'rgba(250, 204, 21, 0.6)' : 'rgba(250, 204, 21, 0)',
            boxShadow: isFocused ? '0 0 30px rgba(250, 204, 21, 0.2)' : '0 0 0px rgba(250, 204, 21, 0)'
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-2 flex items-center text-sm text-red-400"
          >
            <span className="mr-2">⚠️</span>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Floating particles background
const ParticleField = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Status indicator with animation
const StatusIndicator = ({ isOpen, tbilisiTime }) => (
  <motion.div
    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
      isOpen ? 'bg-green-500/20 text-green-400 border border-green-400/40' : 
      'bg-red-500/20 text-red-400 border border-red-400/40'
    }`}
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <motion.div
      className={`w-2 h-2 rounded-full mr-2 ${isOpen ? 'bg-green-400' : 'bg-red-400'}`}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    {isOpen ? `Open Now (${tbilisiTime})` : `Closed (${tbilisiTime})`}
  </motion.div>
);

// Main Contact Page Component
export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle');
  const [localTime, setLocalTime] = useState('');
  const [tbilisiTime, setTbilisiTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.8, 0.6]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormStatus('sending');
    
    // Simulate API call with realistic timing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form Submitted:', formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => setFormStatus('idle'), 4000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const options = { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true,
        timeZoneName: 'short'
      };
      
      setLocalTime(now.toLocaleTimeString('en-US', options));
      
      const tbilisiOptions = { ...options, timeZone: 'Asia/Tbilisi' };
      const tbilisiDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tbilisi' }));
      setTbilisiTime(tbilisiDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      
      const tbilisiHour = tbilisiDate.getHours();
      // Open from 14:00 (2 PM) to 02:00 (2 AM next day)
      setIsOpen(tbilisiHour >= 14 || tbilisiHour < 2);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  const getButtonContent = () => {
    switch (formStatus) {
      case 'sending': return { text: 'Sending...', icon: '⏳' };
      case 'success': return { text: 'Message Sent!', icon: '✨' };
      case 'error': return { text: 'Try Again', icon: '🔄' };
      default: return { text: 'Send Message', icon: '🚀' };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%)]" />
        <ParticleField />
      </motion.div>
      
      <section className="relative z-10 py-20 px-6 text-yellow-100">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-center mb-24"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold font-serif mb-8 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Observe Us
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Whether for reservations, quantum collaborations, or philosophical inquiries, 
              we're here to collapse the wave function of uncertainty.
            </motion.p>
          </motion.div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            <ContactCard icon="📍" title="Location" delay={0.1}>
              <div className="space-y-2">
                <p className="text-lg font-semibold">6 Shalva Dadiani Street</p>
                <p>Tbilisi, Georgia</p>
                <motion.a 
                  href="#map" 
                  className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mt-2"
                  whileHover={{ x: 5 }}
                >
                  View on Map →
                </motion.a>
              </div>
            </ContactCard>
            
            <ContactCard icon="📞" title="Connect" delay={0.2}>
              <div className="space-y-3">
                <motion.a 
                  href="tel:+995599011262" 
                  className="block text-lg hover:text-yellow-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  +995 599 011 262
                </motion.a>
                <motion.a 
                  href="mailto:info@schrodingerscat.ge" 
                  className="block hover:text-yellow-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  info@schrodingerscat.ge
                </motion.a>
              </div>
            </ContactCard>
            
            <ContactCard icon="🕒" title="Hours" delay={0.3}>
              <div className="space-y-3">
                <p className="text-lg font-semibold">2:00 PM – 2:00 AM</p>
                <p className="text-yellow-200/80">Tbilisi Time</p>
                <StatusIndicator isOpen={isOpen} tbilisiTime={tbilisiTime} />
                <p className="text-sm text-yellow-100/60">Your time: {localTime}</p>
              </div>
            </ContactCard>
            
            <ContactCard icon="🌟" title="Experience" delay={0.4}>
              <p>Quantum gastronomy meets philosophical dining in the heart of Tbilisi's cultural district.</p>
            </ContactCard>
            
            <ContactCard icon="📱" title="Social Universe" delay={0.5}>
              <div className="space-y-2">
                <motion.a 
                  href="https://instagram.com" 
                  className="block hover:text-pink-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  📸 @schrodingerscat_tbilisi
                </motion.a>
                <motion.a 
                  href="https://facebook.com" 
                  className="block hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  📘 Schrödinger's Cat Tbilisi
                </motion.a>
              </div>
            </ContactCard>
            
            <ContactCard icon="🎭" title="Events" delay={0.6}>
              <p>Private dining, corporate events, and quantum theory discussions available upon request.</p>
            </ContactCard>
          </div>

          {/* Contact Form & Map Section */}
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Enhanced Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-green-950/60 to-green-900/40 p-8 rounded-3xl border border-yellow-400/30 backdrop-blur-lg shadow-2xl">
                <motion.h2 
                  className="text-4xl font-bold font-serif text-yellow-300 mb-8 text-center"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Send a Message
                </motion.h2>
                
                <div className="space-y-6">
                  <FormField 
                    id="name" 
                    label="Name" 
                    icon="👤"
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your name" 
                    error={errors.name} 
                  />
                  
                  <FormField 
                    id="email" 
                    label="Email" 
                    type="email" 
                    icon="✉️"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="your@email.com" 
                    error={errors.email} 
                  />
                  
                  <FormField 
                    id="message" 
                    label="Message" 
                    icon="💭"
                    value={formData.message} 
                    onChange={handleInputChange} 
                    placeholder="Share your thoughts, questions, or booking requests..." 
                    error={errors.message}
                  >
                    <textarea rows="5" />
                  </FormField>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(250, 204, 21, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={formStatus === 'sending'}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      formStatus === 'success' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : formStatus === 'error'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400'
                    } disabled:opacity-70 disabled:cursor-not-allowed shadow-lg`}
                  >
                    <motion.span
                      className="flex items-center justify-center"
                      animate={{ opacity: 1 }}
                      key={formStatus}
                    >
                      <span className="mr-2">{buttonContent.icon}</span>
                      {buttonContent.text}
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Interactive Map */}
            <motion.div 
              id="map"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3 h-[600px] w-full bg-gradient-to-br from-green-950/60 to-green-900/40 rounded-3xl border border-yellow-400/30 overflow-hidden backdrop-blur-lg shadow-2xl"
            >
              <div className="relative h-full">
                <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-yellow-400/30">
                  <p className="text-yellow-300 font-semibold text-sm">📍 Find Us Here</p>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.8846205448084!2d44.796773!3d41.7196699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440d4637baa9ff%3A0x61b4b7d9b9b4b7d9!2s6%20Shalva%20Dadiani%20St%2C%20T'bilisi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1625841381358!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'brightness(0.9) contrast(1.1) hue-rotate(30deg)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Schrödinger's Cat Location - 6 Shalva Dadiani Street, Tbilisi"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}