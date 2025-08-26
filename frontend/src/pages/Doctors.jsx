import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  Filter,
  Search,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);          // ← track checkbox
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const specialityList = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ];

  // Unified filtering: speciality → searchTerm → availability
  useEffect(() => {
    let results = doctors;

    if (speciality) {
      results = results.filter((d) => d.speciality === speciality);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.speciality.toLowerCase().includes(term)
      );
    }

    if (onlyAvailable) {
      results = results.filter((d) => d.available);
    }

    setFilterDoc(results);
  }, [doctors, speciality, searchTerm, onlyAvailable]);

  return (
    <div className="min-h-screen pt-8 pb-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 dark:text-white">
            {speciality ? `${speciality} Specialists` : 'Find Your Doctor'}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400">
            Browse through our network of trusted specialists and book your
            appointment in just a few clicks.
          </p>
        </div>

        {/* Search & Mobile Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or speciality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="w-full md:hidden flex justify-end">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                showFilter
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {showFilter ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`${showFilter ? 'block' : 'hidden md:block'} w-full md:w-64 lg:w-72 flex-shrink-0`}>
            <div className="sticky top-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              {/* Specialities */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg dark:text-white">Specialities</h3>
                <button onClick={() => setShowFilter(false)} className="md:hidden text-gray-500 dark:text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <div
                  onClick={() => navigate('/doctors')}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    !speciality
                      ? 'bg-primary/10 border border-primary/20 text-primary font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span>All Specialists</span>
                  {!speciality && <CheckCircle className="w-4 h-4 text-primary" />}
                </div>
                {specialityList.map((cat) => (
                  <div
                    key={cat}
                    onClick={() =>
                      navigate(speciality === cat ? '/doctors' : `/doctors/${cat}`)
                    }
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      speciality === cat
                        ? 'bg-primary/10 border border-primary/20 text-primary font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span>{cat}</span>
                    {speciality === cat && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                ))}
              </div>

              {/* Availability */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold dark:text-white mb-4">Availability</h3>
                <label className="flex items-center space-x-3 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                  />
                  <span>Available Now</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Doctors List */}
          <main className="flex-1">
            {filterDoc.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold dark:text-gray-300 mb-2">No doctors found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterDoc.map((doctor) => (
                  <article
                    key={doctor._id}
                    onClick={() => {
                      navigate(`/appointment/${doctor._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                               rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all
                               duration-300 hover:-translate-y-1"
                  >
                    {/* Image & Badge */}
                    <div className="relative">
                      <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
                                        font-medium backdrop-blur-sm ${
                                          doctor.available
                                            ? 'bg-green-500/80 text-white'
                                            : 'bg-red-600/80 text-white'
                                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            doctor.available ? 'bg-white' : 'bg-gray-300'
                          }`} />
                          <span>{doctor.available ? 'Available Now' : 'Not Available'}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center justify-between text-white text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{doctor.experience}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" fill="white" />4.9
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <h3 className="font-semibold dark:text-white mb-1">Dr. {doctor.name}</h3>
                      <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        {doctor.speciality} • {doctor.degree}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <MapPin className="w-3 h-3" />
                        {doctor.address.line1}
                        {doctor.address.line2 && `, ${doctor.address.line2}`}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium text-primary">
                          Fees: ₹{doctor.fees}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/appointment/${doctor._id}`);
                            window.scrollTo(0, 0);
                          }}
                          className="flex items-center gap-1 text-xs font-medium text-primary
                                     group-hover:underline transition-all"
                        >
                          Book Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
