// src/pages/Reservations.jsx
import React, { useState, useMemo, useEffect, useReducer, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

// --- Enhanced State Management ---
const initialState = {
  partySize: 2,
  date: null,
  time: null,
  name: '',
  email: '',
  phone: '',
  requests: '',
  dietaryRestrictions: '',
  preferredSeating: 'no-preference'
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'RESET':
      return initialState;
    case 'SET_MULTIPLE':
      return { ...state, ...action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// --- Utility Functions ---
const getTbilisiTime = () => {
  try {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tbilisi' }));
  } catch (error) {
    // Fallback if timezone not supported
    return new Date(new Date().getTime() + (4 * 60 * 60 * 1000)); // UTC+4
  }
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return cleaned.length >= 7 && phoneRegex.test(cleaned);
};

// --- Enhanced Helper Components ---
const StepButton = ({ onClick, children, disabled = false, secondary = false, loading = false }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled || loading}
    className={`relative w-full md:w-auto px-10 py-3 font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
      secondary 
        ? 'bg-transparent border-2 border-yellow-400/80 text-yellow-300 hover:bg-yellow-400/10'
        : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-yellow-400/30'
    }`}
  >
    {loading && (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      />
    )}
    <span className={loading ? 'ml-6' : ''}>{children}</span>
  </motion.button>
);

const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center mb-8">
    <div className="flex items-center space-x-4">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i + 1 <= currentStep
                ? 'bg-yellow-400 text-black'
                : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
            }`}
          >
            {i + 1}
          </motion.div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-1 rounded transition-all duration-300 ${
              i + 1 < currentStep ? 'bg-yellow-400' : 'bg-yellow-400/20'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const businessHours = { 
  open: 13, 
  close: 21, 
  closedDays: [1], // Closed Mondays
  maxReservationDays: 60 // Maximum days in advance
};

// --- Main Reservations Component ---
export default function Reservations() {
  const [step, setStep] = useState(1);
  const [booking, dispatch] = useReducer(bookingReducer, initialState);
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const updateBooking = useCallback((field, payload) => {
    dispatch({ type: 'UPDATE_FIELD', field, payload });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 2:
        if (!booking.date) newErrors.date = 'Please select a date';
        break;
      case 3:
        if (!booking.time) newErrors.time = 'Please select a time';
        break;
      case 4:
        if (!booking.name.trim()) newErrors.name = 'Name is required';
        if (!booking.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!isValidEmail(booking.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (booking.phone && !isValidPhone(booking.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (nextStep) => {
    if (validateStep(step)) {
      setStep(nextStep);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setStatus('sending');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send the data to your backend
      console.log("Final Booking:", booking);
      
      setStatus('success');
    } catch (error) {
      console.error('Booking failed:', error);
      setStatus('error');
    }
  };

  const resetBooking = () => {
    setStatus('idle');
    dispatch({ type: 'RESET' });
    setStep(1);
    setErrors({});
  };

  const steps = [
    <PartyStep key="party" booking={booking} updateBooking={updateBooking} onNext={() => handleNext(2)} />,
    <DateStep key="date" booking={booking} updateBooking={updateBooking} onNext={() => handleNext(3)} onBack={() => setStep(1)} errors={errors} />,
    <TimeStep key="time" booking={booking} updateBooking={updateBooking} onNext={() => handleNext(4)} onBack={() => setStep(2)} errors={errors} />,
    <DetailsStep key="details" booking={booking} updateBooking={updateBooking} onNext={handleSubmit} onBack={() => setStep(3)} status={status} errors={errors} />
  ];

  if (status === 'success') {
    return <ConfirmationScreen booking={booking} onReset={resetBooking} />;
  }

  if (status === 'error') {
    return <ErrorScreen onRetry={() => setStatus('idle')} onReset={resetBooking} />;
  }

  return (
    <>
      <Helmet>
        <title>Reservations | Schrödinger's Cat</title>
        <meta name="description" content="Book your table and observe a unique culinary experiment. Our interactive system makes reserving your spot easy." />
      </Helmet>
      <div className="max-w-4xl mx-auto py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }} 
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-yellow-300 mb-6">
            Observe Your Table
          </h1>
          <p className="text-xl text-yellow-100/80 max-w-2xl mx-auto">
            Follow the steps to collapse the wave function on your preferred dining experience.
          </p>
        </motion.div>
        
        <div className="bg-green-950/40 p-8 md:p-12 rounded-3xl border border-yellow-400/20 shadow-2xl backdrop-blur-sm">
          <ProgressIndicator currentStep={step} totalSteps={4} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {steps[step - 1]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// --- Enhanced Step Components ---

const PartyStep = ({ booking, updateBooking, onNext }) => (
  <div>
    <h2 className="text-center text-3xl font-bold font-serif text-yellow-300 mb-10">
      Step 1: How many observers?
    </h2>
    <div className="flex justify-center items-center gap-4 md:gap-6 my-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
        <motion.button 
          key={size} 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => updateBooking('partySize', size)} 
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full text-lg md:text-2xl font-bold border-2 transition-all ${
            booking.partySize === size 
              ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg' 
              : 'border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10'
          }`}
        >
          {size}
        </motion.button>
      ))}
    </div>
    <p className="text-center text-yellow-100/60 text-sm mb-8">
      For parties larger than 8, please call us directly at +995 555 123 456
    </p>
    <div className="text-center mt-16">
      <StepButton onClick={onNext}>Next: Choose Date</StepButton>
    </div>
  </div>
);

const DateStep = ({ booking, updateBooking, onNext, onBack, errors }) => {
  const [displayDate, setDisplayDate] = useState(() => new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + businessHours.maxReservationDays);

  const handleMonthChange = (offset) => {
    setDisplayDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return newDate;
    });
  };
  
  const isPastMonth = displayDate.getFullYear() === today.getFullYear() && 
                     displayDate.getMonth() === today.getMonth();
  const isFutureMonth = displayDate > maxDate;

  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay();

  return (
    <div>
      <h2 className="text-center text-3xl font-bold font-serif text-yellow-300 mb-6">
        Step 2: Select a Date
      </h2>
      <div className="text-center mb-6">
        <p className="text-yellow-400 text-sm mb-2">
          All times are in Tbilisi time (UTC+4)
        </p>
        <p className="text-yellow-100/60 text-xs">
          Reservations available up to {businessHours.maxReservationDays} days in advance
        </p>
      </div>
      
      <div className="bg-black/20 p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => handleMonthChange(-1)} 
            disabled={isPastMonth}
            className="px-4 py-2 rounded-lg hover:bg-yellow-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          <span className="font-bold text-xl text-yellow-200">
            {displayDate.toLocaleString('default', { month: 'long' })} {displayDate.getFullYear()}
          </span>
          <button 
            onClick={() => handleMonthChange(1)} 
            disabled={isFutureMonth}
            className="px-4 py-2 rounded-lg hover:bg-yellow-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="w-12 h-8 flex items-center justify-center text-xs text-yellow-100/50 font-semibold">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="w-12 h-12"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
            const day = dayIndex + 1;
            const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
            const isPast = date < today;
            const isTooFar = date > maxDate;
            const isClosed = businessHours.closedDays.includes(date.getDay());
            const isSelected = booking.date && date.getTime() === booking.date.getTime();
            const isDisabled = isPast || isClosed || isTooFar;
            
            return (
              <motion.button 
                key={day} 
                whileHover={{ scale: isDisabled ? 1 : 1.1 }} 
                whileTap={{ scale: isDisabled ? 1 : 0.95 }} 
                onClick={() => !isDisabled && updateBooking('date', date)} 
                className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all relative ${
                  isDisabled 
                    ? 'text-yellow-100/20 cursor-not-allowed' 
                    : isSelected 
                      ? 'bg-yellow-400 text-black shadow-lg' 
                      : 'text-yellow-300 hover:bg-yellow-400/20 border border-transparent hover:border-yellow-400/30'
                }`} 
                disabled={isDisabled}
                title={isClosed ? 'Closed on Mondays' : isPast ? 'Date has passed' : isTooFar ? 'Too far in advance' : ''}
              >
                {day}
                {isClosed && !isPast && !isTooFar && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-red-400 rotate-45"></div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {errors.date && (
        <p className="text-red-400 text-sm text-center mb-4">{errors.date}</p>
      )}
      
      <div className="flex justify-between items-center">
        <StepButton onClick={onBack} secondary>Back</StepButton>
        <StepButton onClick={onNext} disabled={!booking.date}>
          Next: Choose Time
        </StepButton>
      </div>
    </div>
  );
};

const TimeStep = ({ booking, updateBooking, onNext, onBack, errors }) => {
  const [localTime, setLocalTime] = useState('');
  const [tbilisiTime, setTbilisiTime] = useState('');
  
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = businessHours.open; h <= businessHours.close; h++) {
      if (h === businessHours.close) {
        slots.push(`${h}:00`); // Last seating at closing hour
      } else {
        slots.push(`${h}:00`);
        slots.push(`${h}:30`);
      }
    }
    return slots;
  }, []);
    
  const availableSlots = useMemo(() => {
    if (!booking.date) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = booking.date.getTime() === today.getTime();
    
    const nowInTbilisi = getTbilisiTime();
    const currentHour = nowInTbilisi.getHours();
    const currentMinute = nowInTbilisi.getMinutes();
    
    // Simulate some booked slots (in a real app, this would come from your API)
    const bookedSlots = getBookedSlots(booking.date);
    
    return timeSlots.filter(slot => {
      const [hour, minute] = slot.split(':').map(Number);
      
      // If it's today, don't show past times (with 1-hour buffer for preparation)
      if (isToday) {
        const slotMinutes = hour * 60 + minute;
        const currentMinutes = currentHour * 60 + currentMinute + 60; // 1-hour buffer
        if (slotMinutes <= currentMinutes) {
          return false;
        }
      }
      
      return !bookedSlots.includes(slot);
    });
  }, [booking.date, timeSlots]);
  
  // Simulate booked slots based on date (in real app, fetch from API)
  const getBookedSlots = (date) => {
    const seed = date.getDate() + date.getMonth();
    const bookedSlots = [];
    timeSlots.forEach((slot, index) => {
      if ((seed + index) % 5 === 0) { // Roughly 20% of slots booked
        bookedSlots.push(slot);
      }
    });
    return bookedSlots;
  };
  
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const tbilisi = getTbilisiTime();
      
      setLocalTime(formatTime(now));
      setTbilisiTime(formatTime(tbilisi));
    };
    
    updateTimes();
    const interval = setInterval(updateTimes, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-center text-3xl font-bold font-serif text-yellow-300 mb-6">
        Step 3: Select a Time
      </h2>
      <div className="text-center mb-6">
        <p className="text-yellow-400 text-sm mb-2">
          Restaurant time: {tbilisiTime} • Your local time: {localTime}
        </p>
        <p className="text-yellow-100/60 text-xs">
          Last seating at 9:00 PM • Kitchen closes at 10:00 PM
        </p>
      </div>
      
      <div className="max-h-80 overflow-y-auto pr-2 mb-6">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {timeSlots.map(time => {
            const isAvailable = availableSlots.includes(time);
            const isSelected = booking.time === time;
            
            return (
              <motion.button 
                key={time} 
                whileHover={{ scale: !isAvailable ? 1 : 1.05 }} 
                whileTap={{ scale: !isAvailable ? 1 : 0.95 }} 
                onClick={() => isAvailable && updateBooking('time', time)} 
                disabled={!isAvailable} 
                className={`py-3 px-2 rounded-lg font-semibold border-2 transition-all text-sm ${
                  !isAvailable 
                    ? 'bg-black/30 border-yellow-400/10 text-yellow-100/30 cursor-not-allowed relative' 
                    : isSelected 
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg' 
                      : 'border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10 hover:border-yellow-400'
                }`}
              >
                {time}
                {!isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs text-red-300">Booked</div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {errors.time && (
        <p className="text-red-400 text-sm text-center mb-4">{errors.time}</p>
      )}
      
      <div className="flex justify-between items-center">
        <StepButton onClick={onBack} secondary>Back</StepButton>
        <StepButton onClick={onNext} disabled={!booking.time}>
          Next: Your Details
        </StepButton>
      </div>
    </div>
  );
};

const DetailsStep = ({ booking, updateBooking, onNext, onBack, status, errors }) => {
  const formFields = [
    { 
      name: 'name', 
      label: 'Full Name', 
      type: 'text', 
      required: true, 
      placeholder: 'Enter your full name' 
    },
    { 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      required: true, 
      placeholder: 'your.email@example.com' 
    },
    { 
      name: 'phone', 
      label: 'Phone Number', 
      type: 'tel', 
      required: false, 
      placeholder: '+995 555 123 456 (optional)' 
    },
    { 
      name: 'dietaryRestrictions', 
      label: 'Dietary Restrictions', 
      type: 'textarea', 
      required: false, 
      placeholder: 'Vegetarian, vegan, allergies, etc.' 
    },
    { 
      name: 'requests', 
      label: 'Special Requests', 
      type: 'textarea', 
      required: false, 
      placeholder: 'Birthday celebration, anniversary, accessibility needs, etc.' 
    }
  ];

  const seatingOptions = [
    { value: 'no-preference', label: 'No Preference' },
    { value: 'window', label: 'Window Table' },
    { value: 'quiet', label: 'Quiet Area' },
    { value: 'bar', label: 'Bar Seating' }
  ];

  return (
    <div>
      <h2 className="text-center text-3xl font-bold font-serif text-yellow-300 mb-10">
        Step 4: Your Details
      </h2>
      
      <div className="space-y-6">
        {formFields.map(field => {
          const isValid = booking[field.name] && !errors[field.name];
          const hasError = errors[field.name];
          
          return (
            <div key={field.name} className="relative">
              <label htmlFor={field.name} className="block text-yellow-300 mb-2 font-semibold">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  value={booking[field.name]}
                  onChange={(e) => updateBooking(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className={`w-full px-4 py-3 pr-10 bg-black/40 border-2 rounded-xl text-yellow-100 placeholder-yellow-400/50 focus:outline-none focus:ring-2 transition-all resize-none ${
                    hasError 
                      ? 'border-red-500/80 focus:ring-red-500' 
                      : 'border-yellow-400/30 focus:ring-yellow-400'
                  }`}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  value={booking[field.name]}
                  onChange={(e) => updateBooking(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-3 pr-10 bg-black/40 border-2 rounded-xl text-yellow-100 placeholder-yellow-400/50 focus:outline-none focus:ring-2 transition-all ${
                    hasError 
                      ? 'border-red-500/80 focus:ring-red-500' 
                      : 'border-yellow-400/30 focus:ring-yellow-400'
                  }`}
                />
              )}
              
              {isValid && (
                <motion.span 
                  initial={{scale: 0}} 
                  animate={{scale: 1}} 
                  className="absolute right-3 top-11 text-green-400 text-lg"
                >
                  ✓
                </motion.span>
              )}
              
              {hasError && (
                <p className="text-red-400 text-sm mt-1">{hasError}</p>
              )}
            </div>
          );
        })}
        
        <div>
          <label className="block text-yellow-300 mb-3 font-semibold">
            Seating Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            {seatingOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateBooking('preferredSeating', option.value)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  booking.preferredSeating === option.value
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center mt-12 gap-6">
        <StepButton onClick={onBack} secondary>Back</StepButton>
        <StepButton 
          onClick={onNext} 
          loading={status === 'sending'}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Confirming Reservation...' : 'Confirm Reservation'}
        </StepButton>
      </div>
    </div>
  );
};

const ConfirmationScreen = ({ booking, onReset }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const createCalendarEvent = () => {
    const startTime = new Date(`${booking.date.toISOString().split('T')[0]}T${booking.time}:00+04:00`);
    const endTime = new Date(startTime.getTime() + (2.5 * 60 * 60 * 1000)); // 2.5 hours
    
    const event = {
      title: `Dinner at Schrödinger's Cat`,
      description: `Reservation for ${booking.partySize} people.\n\nContact: ${booking.email}${booking.phone ? `\nPhone: ${booking.phone}` : ''}\n\nSpecial requests: ${booking.requests || 'None'}\nDietary restrictions: ${booking.dietaryRestrictions || 'None'}`,
      location: `18 Kiacheli Street, Tbilisi 0108, Georgia`,
      startTime,
      endTime
    };
    
    const formatDateTime = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateTime(event.startTime)}/${formatDateTime(event.endTime)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    // iCal format
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schrödinger's Cat//Reservation//EN
BEGIN:VEVENT
UID:${Date.now()}@schrodingers-cat.ge
DTSTART:${formatDateTime(event.startTime)}
DTEND:${formatDateTime(event.endTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
    
    return { googleCalUrl, icalContent };
  };

  const { googleCalUrl, icalContent } = createCalendarEvent();
  
  const downloadIcal = () => {
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schrodingers-cat-reservation.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-green-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 50 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }} 
        className="max-w-2xl w-full bg-gradient-to-br from-green-900/90 to-black/90 p-8 rounded-3xl border border-yellow-400/50 shadow-2xl text-center backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0, rotate: -180 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ delay: 0.3, duration: 0.8, type: 'spring' }} 
          className="text-6xl mb-6 text-green-400"
        >
          ✨
        </motion.div>
        
        <h2 className="text-4xl font-bold font-serif text-yellow-300 mb-4">
          Quantum State Collapsed!
        </h2>
        
        <p className="text-yellow-100/80 mb-8 text-lg">
          Your reservation has been confirmed, {booking.name}. 
          A confirmation email is materializing in your inbox.
        </p>
        
        <div className="bg-black/40 p-6 rounded-2xl border border-yellow-400/20 mb-8 text-left">
          <h3 className="text-yellow-300 font-bold mb-4 text-center">Reservation Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <p><span className="text-yellow-400">👥 Party Size:</span> {booking.partySize} {booking.partySize === 1 ? 'person' : 'people'}</p>
              <p><span className="text-yellow-400">📅 Date:</span> {formatDate(booking.date)}</p>
              <p><span className="text-yellow-400">🕒 Time:</span> {booking.time} (Tbilisi Time)</p>
              <p><span className="text-yellow-400">📧 Email:</span> {booking.email}</p>
            </div>
            <div className="space-y-3">
              {booking.phone && (
                <p><span className="text-yellow-400">📱 Phone:</span> {booking.phone}</p>
              )}
              <p><span className="text-yellow-400">🪑 Seating:</span> {booking.preferredSeating.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              {booking.dietaryRestrictions && (
                <p><span className="text-yellow-400">🥗 Dietary:</span> {booking.dietaryRestrictions}</p>
              )}
              {booking.requests && (
                <p><span className="text-yellow-400">💬 Requests:</span> {booking.requests}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h4 className="text-yellow-300 font-semibold mb-4">Add to Calendar</h4>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href={googleCalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
            >
              📅 Google Calendar
            </a>
            <button 
              onClick={downloadIcal}
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600/20 border border-purple-400/50 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium"
            >
              📲 Download iCal
            </button>
          </div>
        </div>
        
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
          <h4 className="text-yellow-300 font-semibold mb-2">Important Information</h4>
          <div className="text-yellow-100/80 text-sm space-y-1">
            <p>• Please arrive 10 minutes before your reservation time</p>
            <p>• Our dress code is smart casual</p>
            <p>• For changes or cancellations, email us at least 24 hours in advance</p>
            <p>• Contact us: +995 555 123 456 or info@schrodingers-cat.ge</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onReset}
            className="px-6 py-3 bg-transparent border border-yellow-400/50 text-yellow-300 rounded-lg hover:bg-yellow-400/10 transition-colors font-medium"
          >
            Make Another Reservation
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Return to Homepage
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ErrorScreen = ({ onRetry, onReset }) => (
  <div className="fixed inset-0 bg-red-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-6">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }} 
      className="max-w-lg w-full bg-gradient-to-br from-red-900/90 to-black/90 p-8 rounded-3xl border border-red-400/50 shadow-2xl text-center"
    >
      <div className="text-6xl mb-6 text-red-400">⚠️</div>
      <h2 className="text-3xl font-bold font-serif text-red-300 mb-4">
        Quantum Entanglement Failed
      </h2>
      <p className="text-red-100/80 mb-8">
        We encountered an error while processing your reservation. 
        Please try again or contact us directly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onRetry}
          className="px-6 py-3 bg-red-600/20 border border-red-400/50 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={onReset}
          className="px-6 py-3 bg-transparent border border-red-400/50 text-red-300 rounded-lg hover:bg-red-400/10 transition-colors"
        >
          Start Over
        </button>
      </div>
      <div className="mt-6 pt-6 border-t border-red-400/20">
        <p className="text-red-100/60 text-sm">
          Need help? Call us at <span className="text-red-300">+995 555 123 456</span>
        </p>
      </div>
    </motion.div>
  </div>
);