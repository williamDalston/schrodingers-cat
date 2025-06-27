// src/pages/Events.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const events = [
  {
    id: 1,
    date: 'June 28 & 29, 2025',
    time: '8:00 PM - 11:30 PM',
    headline: 'Quantum Harmonies: A Two-Night Musical Experiment',
    subtitle: 'Mariam Bolkvadze, Luca Lombardi, Nika Mezvrishvili',
    description:
      'Experience an extraordinary fusion of Georgian vocal traditions with contemporary jazz arrangements. This superposition of classical and modern will collapse into pure musical magic.',
    lineup: [
      {
        name: 'Mariam Bolkvadze',
        instrument: 'vocals',
        bio: 'Acclaimed Georgian vocalist known for her ethereal interpretations',
      },
      {
        name: 'Luca Lombardi',
        instrument: 'guitar',
        bio: 'Italian guitarist blending Mediterranean warmth with jazz sophistication',
      },
      {
        name: 'Nika Mezvrishvili',
        instrument: 'keys',
        bio: 'Master pianist bridging traditional Georgian melodies with modern harmonies',
      },
    ],
    type: 'featured',
    genre: 'Jazz Fusion',
    capacity: 'Intimate Setting (40 seats)',
    image: '🎭',
    status: 'past',
  },
  {
    id: 2,
    date: 'June 22, 2025',
    time: '9:00 PM - 10:30 PM',
    headline: 'Resonance Theory: An Evening of Vocal Chemistry',
    subtitle: 'Burjanadze x Svanidze',
    description:
      'Two powerhouse voices converge in an intimate acoustic exploration. Watch as musical particles collide to create something entirely new.',
    lineup: [
      {
        name: 'Ketevan Burjanadze',
        instrument: 'vocals',
        bio: 'Renowned for her dynamic range and emotional depth',
      },
      {
        name: 'Nata Svanidze',
        instrument: 'piano',
        bio: 'Classically trained pianist with a gift for improvisation',
      },
    ],
    type: 'acoustic',
    genre: 'Vocal Jazz',
    capacity: 'Intimate Setting (30 seats)',
    image: '🎹',
    status: 'past',
  },
  {
    id: 3,
    date: 'June 21, 2025',
    time: '7:30 PM - 10:00 PM',
    headline: 'Probability Waves: The Trio Experiment',
    subtitle: 'Mariam Bolkvadze Trio',
    description:
      'Three artists, infinite possibilities. This opening night performance demonstrated that musical uncertainty principles create the most beautiful outcomes.',
    lineup: [
      {
        name: 'Mariam Bolkvadze',
        instrument: 'vocals',
        bio: 'Leading voice in contemporary Georgian music',
      },
      {
        name: 'Luca Lombardi',
        instrument: 'guitar',
        bio: 'Virtuoso guitarist with Mediterranean soul',
      },
      {
        name: 'Lasha Uznadze',
        instrument: 'drums',
        bio: 'Rhythmic architect known for his innovative percussive textures',
      },
    ],
    type: 'opening',
    genre: 'Contemporary Jazz',
    capacity: 'Full House (50 seats)',
    image: '🥁',
    status: 'past',
  },
];

const upcomingEvents = [
  {
    id: 4,
    date: 'July 15, 2025',
    time: '8:30 PM - 11:00 PM',
    headline: 'Quantum Entanglement: Electronic Meets Acoustic',
    subtitle: 'TBA - Special International Guest',
    description:
      'An experimental evening where electronic soundscapes entangle with traditional Georgian instruments. The lineup remains in quantum superposition until observed.',
    lineup: [
      {
        name: 'Artist TBA',
        instrument: 'electronic',
        bio: 'International electronic artist specializing in ambient fusion',
      },
      {
        name: 'Guest Musicians',
        instrument: 'traditional Georgian',
        bio: 'Masters of panduri, chonguri, and vocal polyphony',
      },
    ],
    type: 'experimental',
    genre: 'Electronic Fusion',
    capacity: 'Limited Seating (35 seats)',
    image: '🔊',
    status: 'upcoming',
  },
];

const EventCard = ({ event, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'from-cyan-400 to-blue-500';
      case 'past':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'featured':
        return '⭐';
      case 'acoustic':
        return '🎵';
      case 'opening':
        return '🎊';
      case 'experimental':
        return '🔬';
      default:
        return '🎶';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
      className="group relative"
    >
      <div className="bg-gradient-to-br from-green-950/60 via-green-900/40 to-black/60 border border-yellow-400/30 rounded-3xl p-8 shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 backdrop-blur-sm overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.3),transparent_70%)]" />

        {/* Status Badge + Icon */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
            className={`px-4 py-2 bg-gradient-to-r ${getStatusColor(
              event.status
            )} text-white text-sm font-bold rounded-full shadow-lg`}
          >
            {event.status === 'upcoming' ? '🚀 UPCOMING' : '📅 PAST EVENT'}
          </motion.div>
          <span className="text-4xl">{event.image}</span>
        </div>

        {/* Event Header */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{getTypeIcon(event.type)}</span>
            <p className="text-sm uppercase tracking-wide text-yellow-400 font-semibold">
              {event.date} • {event.time}
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-serif text-yellow-300 mb-2 group-hover:text-yellow-200 transition-colors">
            {event.headline}
          </h2>

          <h3 className="text-lg text-cyan-300 font-semibold mb-4">
            {event.subtitle}
          </h3>

          <p className="text-yellow-100/80 leading-relaxed mb-6">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-6 relative z-10">
          <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
            <h4 className="text-yellow-300 font-semibold mb-2">🎭 Genre</h4>
            <p className="text-yellow-100/80">{event.genre}</p>
          </div>
          <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
            <h4 className="text-yellow-300 font-semibold mb-2">👥 Capacity</h4>
            <p className="text-yellow-100/80">{event.capacity}</p>
          </div>
        </div>

        {/* Lineup */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-yellow-300">🎼 Lineup</h4>
            <motion.button
              onClick={() => {
                setIsExpanded(!isExpanded);
                setSelectedArtist(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-yellow-400/20 text-yellow-300 rounded-lg border border-yellow-400/30 hover:bg-yellow-400/30 transition-colors text-sm font-medium"
            >
              {isExpanded ? 'Show Less' : 'Show Details'}
            </motion.button>
          </div>

          <div className="space-y-3">
            {event.lineup.map((artist, i) => (
              <motion.div
                key={i}
                className={`flex items-center justify-between p-3 bg-green-950/40 rounded-xl border transition-colors cursor-pointer ${
                  selectedArtist === i
                    ? 'border-yellow-400/40'
                    : 'border-yellow-400/10 hover:border-yellow-400/30'
                }`}
                whileHover={{ x: 5 }}
                onClick={() =>
                  setSelectedArtist(selectedArtist === i ? null : i)
                }
              >
                <div>
                  <span className="text-yellow-200 font-medium">
                    {artist.name}
                  </span>
                  <span className="text-yellow-400/70 ml-2">
                    ({artist.instrument})
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: selectedArtist === i ? 180 : 0 }}
                  className="text-yellow-400"
                >
                  ↓
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Artist Details */}
          <AnimatePresence>
            {(isExpanded || selectedArtist !== null) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                {events
                  .find((e) => e.id === event.id)
                  .lineup.map((artist, i) => (
                    <AnimatePresence key={i}>
                      {(isExpanded || selectedArtist === i) && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-black/40 p-4 rounded-xl border-l-4 border-cyan-400"
                        >
                          <h5 className="text-cyan-300 font-semibold mb-2">
                            {artist.name}
                          </h5>
                          <p className="text-yellow-100/70 text-sm">
                            {artist.bio}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {event.status === 'upcoming' && (
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-yellow-400/30 transition-all duration-300 relative z-10"
          >
            Reserve Your Spot →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const EventTimeline = ({ events, title, subtitle }) => (
  <div className="mb-20">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-4xl md:text-5xl font-bold font-serif text-yellow-300 mb-4">
        {title}
      </h2>
      <p className="text-lg text-yellow-100/70 max-w-2xl mx-auto">{subtitle}</p>
    </motion.div>

    <div className="grid lg:grid-cols-2 gap-8">
      {events.map((evt, idx) => (
        <EventCard key={evt.id} event={evt} index={idx} />
      ))}
    </div>
  </div>
);

export default function Events() {
  return (
    <>
      <Helmet>
        <title>Events | Schrödinger's Cat</title>
        <meta
          name="description"
          content="Quantum musical experiments at Schrödinger's Cat - where sound waves collapse into unforgettable performances. Past events and upcoming shows."
        />
      </Helmet>

      <div className="relative min-h-screen">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-green-950 to-black opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.1),transparent_70%)]" />

        <section className="relative z-10 py-24 px-6 text-yellow-100">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <span className="text-8xl">🎭</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold font-serif text-yellow-300 mb-6">
                Musical{' '}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Experiments
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-yellow-100/80 max-w-4xl mx-auto leading-relaxed">
                Where sound waves collapse into unforgettable performances.
                <br />
                <span className="text-cyan-300 font-semibold">
                  Each show is a unique observation in our musical laboratory.
                </span>
              </p>
            </motion.div>

            {/* Upcoming Events */}
            <EventTimeline
              events={upcomingEvents}
              title="Upcoming Observations"
              subtitle="Future experiments in sound, waiting to be observed and experienced"
            />

            {/* Past Events */}
            <EventTimeline
              events={events}
              title="Past Experiments"
              subtitle="Successfully collapsed wave functions of sound - these performances have been observed and celebrated"
            />

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-r from-green-950/60 to-black/60 p-12 rounded-3xl border border-yellow-400/30 backdrop-blur-sm"
            >
              <h3 className="text-3xl font-bold font-serif text-yellow-300 mb-4">
                Stay in the Loop
              </h3>
              <p className="text-yellow-100/80 mb-8 max-w-2xl mx-auto">
                Be the first to know about our upcoming musical experiments. No
                spam, just pure quantum entertainment updates.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-3 bg-black/40 border border-yellow-400/30 rounded-xl text-yellow-100 placeholder-yellow-400/50 focus:outline-none focus:border-yellow-400 transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
