import React, { useContext, useState, useEffect } from 'react';         // ← added useEffect
import { assets } from '../assets/assets';
import {
  NavLink,
  useNavigate,
  useLocation,                      // ← added useLocation
} from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();               // now defined
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const { theme, setTheme } = useContext(ThemeContext);

  /* scroll listener */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* theme switch */
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  /* logout */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  return (
    <div 
      className={`sticky top-0 left-0 right-0 z-30 transition-all duration-300 
                 ${scrolled 
                   ? 'py-2 bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-primary/5 backdrop-blur-md' 
                   : 'py-4 bg-gradient-to-b from-white/80 to-transparent dark:from-slate-900/80 dark:to-transparent'}
                 dark:text-gray-100`}
    >
      <div className="w-full mx-auto flex items-center justify-between relative">
        {/* Decorative Elements */}
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full 
                        bg-gradient-to-br from-primary/20 to-primary/5 blur-xl hidden lg:block"></div>
        <div className="absolute -right-8 top-3/4 transform -translate-y-1/2 w-16 h-16 rounded-full 
                        bg-gradient-to-tl from-blue-500/10 to-primary/10 blur-xl hidden lg:block"></div>
                        
        {/* Logo */}
        <div className="flex items-center">
          <img
              onClick={() => navigate('/')}
              src={theme === 'dark' ? assets.logo_dark : assets.logo}
              alt="Logo"
              className="w-36 md:w-40 cursor-pointer transition-all hover:opacity-80 drop-shadow-sm"
          />
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex items-center gap-1 lg:gap-2 font-medium text-sm tracking-wide bg-white/100 dark:bg-slate-800/50 
+                       backdrop-blur-sm rounded-full px-2 py-1 shadow-lg border border-gray-200/50 dark:border-slate-700/50">
            {[
              { path: '/', label: 'HOME' },
              { path: '/doctors', label: 'DOCTORS' },
              { path: '/about', label: 'ABOUT' },
              { path: '/contact', label: 'CONTACT' }
            ].map(item => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `
   block px-4 py-2 rounded-full transition-all duration-300
   ${isActive
     ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200'
     : 'text-gray-700 dark:text-gray-200 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20'
   }
 `}
              >
                {item.label}
              </NavLink>
            ))}
          </ul>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative overflow-hidden
                       border ${theme === 'light' 
                         ? 'border-gray-200 shadow-sm' 
                         : 'border-slate-700'}`}
            aria-label="Toggle dark mode"
            title="Toggle Theme"
          >
            <div className={`absolute inset-0 transition-all duration-500 ${theme === 'light' 
              ? 'bg-gradient-to-br from-blue-50 to-gray-100' 
              : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}></div>
            <span className="relative text-lg">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
          </button>

          {/* User Profile / Login */}
          {token && userData ? (
            <div className="relative group">
              <div className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-full 
                             border border-gray-200 dark:border-slate-700
                             shadow-sm bg-white dark:bg-slate-800
                             transition-all hover:shadow-md">
                <span className="hidden lg:block font-medium max-w-24 truncate">{userData.name}</span>
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      src={userData.image} 
                      alt="Profile" 
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-800
                                 bg-gradient-to-br from-green-400 to-green-500"></div>
                </div>
              </div>

              {/* Dropdown */}
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 
                             group-hover:visible transition-all duration-200 z-20 transform translate-y-2
                             group-hover:translate-y-0">
                <div className="min-w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden
                               border border-gray-100 dark:border-slate-700">
                  <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-br 
                                 from-primary/5 to-blue-500/5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md">
                        <img 
                          className="w-full h-full object-cover" 
                          src={userData.image} 
                          alt="Profile" 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{userData.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col py-2">
                    <button
                      onClick={() => navigate('/my-profile')}
                      className="group/item px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center 
                                     text-primary group-hover/item:bg-primary/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => navigate('/my-appointments')}
                      className="group/item px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center 
                                     text-primary group-hover/item:bg-primary/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <span>My Appointments</span>
                    </button>
                    <button
                      onClick={logout}
                      className="group/item px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 
                               flex items-center gap-3 mt-1 mb-1 mx-2 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center 
                                     text-red-500 group-hover/item:bg-red-500/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                      </div>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-medium hidden lg:block hover:text-primary/80 transition-all relative"
              >
                <span>Sign In</span>
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary/20 transform origin-left 
                               scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90 active:bg-primary/80 text-white px-4 md:px-5 py-2 rounded-full 
                           font-medium transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 via-transparent to-transparent 
                               transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                       className="hidden md:inline-block">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  <span>Join Now</span>
                </span>
              </button>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setShowMenu(true)}
            className={`w-10 h-10 flex lg:hidden items-center justify-center rounded-full transition-all
                       ${theme === 'light' 
                         ? 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200' 
                         : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity 
                   ${showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowMenu(false)}
      >
        <div 
          className={`absolute top-0 right-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl 
                     transition-transform duration-300 ease-in-out transform 
                     ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
            <img src={assets.logo} className="w-32" alt="Logo" />
            <button
              onClick={() => setShowMenu(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full
                       bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {token && userData && (
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">
              <img 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary" 
                src={userData.image} 
                alt="Profile" 
              />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{userData.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userData.email}</p>
              </div>
            </div>
          )}
          
          <div className="p-5">
            <nav>
              <ul className="flex flex-col gap-1">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/doctors', label: 'Find Doctors' },
                  { path: '/about', label: 'About Us' },
                  { path: '/contact', label: 'Contact' },
                ].map((item) => (
                  <li key={item.path}>
                    <NavLink 
                      to={item.path}
                      onClick={() => setShowMenu(false)}
                      className={({ isActive }) => 
                        `block py-3 px-4 rounded-lg transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            
            {token && userData ? (
              <div className="mt-6 flex flex-col gap-1">
                <p className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 ml-1 mb-1">
                  Account
                </p>
                <button
                  onClick={() => {
                    navigate('/my-profile')
                    setShowMenu(false)
                  }}
                  className="py-3 px-4 rounded-lg text-left text-gray-700 dark:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center gap-3"
                >
                  <span className="text-gray-500">👤</span> My Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/my-appointments')
                    setShowMenu(false)
                  }}
                  className="py-3 px-4 rounded-lg text-left text-gray-700 dark:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center gap-3"
                >
                  <span className="text-gray-500">📅</span> My Appointments
                </button>
                <button
                  onClick={() => {
                    logout()
                    setShowMenu(false)
                  }}
                  className="py-3 px-4 rounded-lg text-left text-red-500
                             hover:bg-gray-100 dark:hover:bg-slate-800 transition-all flex items-center gap-3"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigate('/login')
                    setShowMenu(false)
                  }}
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-slate-700
                             text-gray-800 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('/register')
                    setShowMenu(false)
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary/90
                             text-white font-medium transition-all"
                >
                  Create Account
                </button>
              </div>
            )}
            
            <div className="mt-8 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Toggle theme</span>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full relative flex items-center 
                         ${theme === 'light' ? 'bg-gray-200' : 'bg-primary'}`}
              >
                <span 
                  className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform 
                           ${theme === 'light' ? 'left-0.5' : 'left-7'}`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
