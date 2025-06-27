// src/pages/Menu.jsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { menuData } from '../data/menuData';

const formatPrice = (priceObj) => {
  if (!priceObj || typeof priceObj.amount !== 'number') return '';
  return `${priceObj.currency || '₾'} ${priceObj.amount.toFixed(0)}`;
};

const MenuItem = ({ item, index, onAddToFavorites, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const getDietaryIcons = (item) => {
    const icons = [];
    if (item.vegetarian) icons.push({ icon: '🌱', label: 'Vegetarian' });
    if (item.vegan) icons.push({ icon: '🌿', label: 'Vegan' });
    if (item.glutenFree) icons.push({ icon: '🌾', label: 'Gluten Free' });
    if (item.spicy) icons.push({ icon: '🌶️', label: 'Spicy' });
    if (item.signature) icons.push({ icon: '⭐', label: 'Signature Dish' });
    return icons;
  };

  return (
    <motion.li
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        className={`relative p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
          isHovered 
            ? 'bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border-yellow-400/40 shadow-lg shadow-yellow-400/20' 
            : 'bg-green-950/30 border-yellow-400/20 hover:border-yellow-400/30'
        }`}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddToFavorites(item)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
            isFavorite 
              ? 'text-red-400 bg-red-400/20' 
              : 'text-yellow-400/60 hover:text-red-400 hover:bg-red-400/10'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <motion.span
            animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </motion.span>
        </motion.button>

        <div className="flex items-baseline mb-3">
          <motion.h3 
            className="text-xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors"
            layoutId={`name-${item.id}`}
          >
            {item.name}
          </motion.h3>
          <motion.div 
            className="flex-grow mx-3 border-b-2 border-dotted border-yellow-400/30 group-hover:border-yellow-400/50 transition-colors"
            animate={{ scaleX: isHovered ? 1.02 : 1 }}
          />
          <motion.span 
            className="text-xl font-mono font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            {formatPrice(item.price)}
          </motion.span>
        </div>

        {getDietaryIcons(item).length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {getDietaryIcons(item).map((dietary, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-400/10 text-xs font-medium text-yellow-200 border border-yellow-400/20"
                title={dietary.label}
              >
                <span className="mr-1">{dietary.icon}</span>
                {dietary.label}
              </motion.span>
            ))}
          </motion.div>
        )}

        <motion.p 
          className="text-yellow-100/80 leading-relaxed group-hover:text-yellow-100/90 transition-colors"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          {item.description}
        </motion.p>

        {item.popular && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          >
            🔥 Popular
          </motion.div>
        )}

        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </motion.div>
    </motion.li>
  );
};

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </motion.div>
    </motion.li>
  );
};

// Filter Chips Component
const FilterChips = ({ activeFilters, onFilterChange, availableFilters }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2 justify-center mb-8"
    >
      {availableFilters.map((filter) => (
        <motion.button
          key={filter.key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilters.includes(filter.key)
              ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30'
              : 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-400/20'
          }`}
        >
          <span className="mr-2">{filter.icon}</span>
          {filter.label}
        </motion.button>
      ))}
    </motion.div>
  );
};

// Search Bar Component
const SearchBar = ({ searchTerm, onSearchChange, resultsCount }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8 max-w-lg mx-auto"
    >
      <div className="relative">
        <motion.input
          type="text"
          placeholder="Search quantum cuisine..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-6 py-4 pl-12 rounded-xl bg-green-950/50 border-2 text-white placeholder-yellow-100/50 focus:outline-none transition-all duration-300 ${
            isFocused 
              ? 'border-yellow-400 shadow-lg shadow-yellow-400/20 bg-green-950/70' 
              : 'border-yellow-400/30 hover:border-yellow-400/50'
          }`}
        />
        <motion.div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          animate={{ scale: isFocused ? 1.1 : 1, color: isFocused ? '#fbbf24' : '#fde047' }}
        >
          🔍
        </motion.div>
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300"
            >
              ✕
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {searchTerm && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-sm text-yellow-200/70 mt-2"
          >
            Found {resultsCount} dish{resultsCount !== 1 ? 'es' : ''} in the quantum kitchen
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const availableFilters = [
    { key: 'vegetarian', label: 'Vegetarian', icon: '🌱' },
    { key: 'vegan', label: 'Vegan', icon: '🌿' },
    { key: 'glutenFree', label: 'Gluten Free', icon: '🌾' },
    { key: 'spicy', label: 'Spicy', icon: '🌶️' },
    { key: 'signature', label: 'Signature', icon: '⭐' },
    { key: 'popular', label: 'Popular', icon: '🔥' }
  ];

  // Enhanced filtering logic
  const filteredMenuItems = useMemo(() => {
    if (!searchTerm && activeFilters.length === 0) {
      return menuData;
    }

    const newMenu = {};
    for (const categoryKey in menuData) {
      const category = menuData[categoryKey];
      let items = category.items;

      // Apply search filter
      if (searchTerm) {
        items = items.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply dietary filters
      if (activeFilters.length > 0) {
        items = items.filter(item =>
          activeFilters.every(filter => item[filter])
        );
      }

      if (items.length > 0) {
        newMenu[categoryKey] = { ...category, items };
      }
    }
    return newMenu;
  }, [searchTerm, activeFilters]);

  // Count total results
  const totalResults = useMemo(() => {
    return Object.values(filteredMenuItems).reduce((total, category) => total + category.items.length, 0);
  }, [filteredMenuItems]);

  const handleFilterChange = (filterKey) => {
    setActiveFilters(prev => 
      prev.includes(filterKey)
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const handleAddToFavorites = (item) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(item.id)) {
        newFavorites.delete(item.id);
      } else {
        newFavorites.add(item.id);
      }
      return newFavorites;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <>
      <Helmet>
        <title>Our Quantum Menu | Schrödinger's Cat</title>
        <meta name="description" content="Explore our quantum-inspired menu, featuring a fusion of Georgian classics and modern culinary experiments." />
        <meta name="keywords" content="restaurant, menu, Georgian cuisine, quantum dining, Tbilisi" />
      </Helmet>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-white max-w-7xl mx-auto"
      >
        {/* Enhanced Header */}
        <motion.div variants={headerVariants} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            🍽️
          </motion.div>
          <h1 className="text-6xl font-extrabold font-serif mb-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Quantum Menu
          </h1>
          <p className="text-xl text-yellow-200/80 max-w-2xl mx-auto leading-relaxed">
            A superposition of flavors where Georgian tradition meets culinary innovation. 
            Each dish exists in multiple states of deliciousness until observed by your taste buds.
          </p>
        </motion.div>

        {/* Search Bar */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultsCount={totalResults}
        />

        {/* Filter Chips */}
        <FilterChips 
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-green-950/50 rounded-xl p-1 border border-yellow-400/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-yellow-400 text-black'
                  : 'text-yellow-300 hover:text-yellow-200'
              }`}
            >
              🔲 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-yellow-400 text-black'
                  : 'text-yellow-300 hover:text-yellow-200'
              }`}
            >
              📋 List
            </button>
          </div>
        </motion.div>

        {/* Menu Content */}
        <AnimatePresence mode="wait">
          <motion.div layout className="space-y-16">
            {Object.keys(filteredMenuItems).length > 0 ? (
              Object.entries(filteredMenuItems).map(([key, category], categoryIndex) => (
                <motion.section 
                  key={key} 
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="relative"
                >
                  <motion.div
                    className="flex items-center justify-between mb-8"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h2 className="text-4xl font-bold font-serif bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                      {category.displayName}
                    </h2>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: categoryIndex * 0.1 + 0.3, duration: 0.8 }}
                      className="flex-grow mx-6 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"
                    />
                    <span className="text-sm text-yellow-400/70 font-medium">
                      {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                    </span>
                  </motion.div>
                  
                  <motion.ul 
                    layout
                    className={`gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 lg:grid-cols-2' 
                        : 'flex flex-col space-y-4'
                    }`}
                  >
                    {category.items.map((item, index) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        index={index}
                        onAddToFavorites={handleAddToFavorites}
                        isFavorite={favorites.has(item.id)}
                      />
                    ))}
                  </motion.ul>
                </motion.section>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  🐱
                </motion.div>
                <h3 className="text-3xl font-bold text-yellow-300 mb-4">
                  No dishes found in this quantum state
                </h3>
                <p className="text-xl text-yellow-100/70 mb-8 max-w-md mx-auto">
                  The cat seems to have eaten all matching dishes. Try adjusting your search or filters.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilters([]);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl shadow-lg hover:shadow-yellow-400/30 transition-all"
                >
                  Reset Quantum State
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Favorites Summary */}
        <AnimatePresence>
          {favorites.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg z-40"
            >
              ❤️ {favorites.size} favorite{favorites.size !== 1 ? 's' : ''}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}