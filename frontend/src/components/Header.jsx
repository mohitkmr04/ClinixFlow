import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import groupProfiles from '../assets/group_profiles.png';
import { ArrowRight, Star } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="relative overflow-hidden w-full h-[70vh] min-h-[28rem] rounded-2xl transition-shadow duration-300 px-4 sm:px-6">
      {/* gradient */}
      <div
        className={`absolute inset-0 h-full w-full bg-[length:400%_400%]
        bg-gradient-to-br from-emerald-400 via-sky-500 to-indigo-600
        dark:from-teal-700/80 dark:via-cyan-800/80 dark:to-sky-800/80
        animate-gradient ${isScrolled ? 'shadow-2xl' : 'shadow-xl'}`}
      />

      {/* dot pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* glass card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative z-10 flex flex-col lg:flex-row items-center gap-10
                     bg-amber-50/40 dark:bg-slate-800/50
                     backdrop-blur-md backdrop-saturate-150
                     ring-1 ring-amber-200 dark:ring-slate-300/20
                     rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl
                     w-full max-w-7xl mx-auto"
        >
          {/* text column */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur
                            rounded-full px-4 py-2 text-gray-900 dark:text-white text-sm font-medium">
              <Star className="w-4 h-4 text-red-300" />
              Top-rated healthcare platform
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight font-serif
                           text-gray-900 dark:text-white">
              Book Your Next <br />
              <span className=" text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-50">
                Health Appointment
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-700 dark:text-white/90 max-w-lg mx-auto lg:mx-0">
              Connect with verified specialists for personalized care at your convenience. Your health journey begins here.
            </p>

            {/* group photo + label */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 lg:justify-start">
              <div className="relative w-16 sm:w-20 md:w-24">
                <img
                  src={groupProfiles}
                  alt="Happy patients"
                  className="w-full h-auto rounded-lg shadow-md object-cover"
                />
              </div>
              <span className="text-gray-800 dark:text-white/90 text-sm">
                <strong>Trusted by 10,000+</strong> patients weekly
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 justify-center lg:justify-start">
              <button
                onClick={() => (window.location.hash = '#speciality')}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-sky-700
                           dark:bg-gray-700 dark:text-white font-semibold shadow-lg
                           hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* hero image */}
          <div className="flex-1 w-full lg:w-1/2">
            <div
              className="relative h-48 sm:h-64 lg:h-96 rounded-2xl overflow-hidden shadow-xl
                         border-4 border-white/40 dark:border-white/10"
            >
              <div
                className="absolute inset-0 bg-gradient-to-t
                           from-black/30 via-white/20 to-transparent
                           dark:from-blue-900/60 dark:via-blue-900/20"
              />
              {/* object-top keeps the top of the picture visible */}
              <img
                src={assets.header_img}
                alt="Doctor Consultation"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* wave */}
      <svg
        className="absolute bottom-0 left-0 w-full text-white dark:text-gray-900"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,224L48,202.7C96,181,192,139,288,112C384,85,480,75,576,90.7C672,107,768,149,864,160C960,171,1056,149,1152,112C1248,75,1344,21,1392,-5.3L1440,-32L1440,320L0,320Z" />
      </svg>

      {/* keyframes */}
      <style jsx>{`
        @keyframes gradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 18s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
