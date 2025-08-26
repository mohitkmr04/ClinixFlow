import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Star, MapPin, CheckCircle, ArrowRight, Clock } from 'lucide-react';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div id="top-doctors" className="py-16 px-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">
            Top Doctors to Book
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 8).map((doctor, index) => (
            <div 
              key={index} 
              onClick={() => {
                navigate(`/appointment/${doctor._id}`);
                window.scrollTo(0, 0);
              }}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
    doctor.available 
      ? 'bg-green-500/80 text-white' 
      : 'bg-red-600/80 text-white'
  } text-[10px] font-medium`}>
    <span className={`w-2 h-2 rounded-full ${
      doctor.available ? 'bg-white' : 'bg-gray-300'
    }`}/>
    <span>{doctor.available ? 'Available Now' : 'Not Available'}</span>
  </div>
</div>

                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Clock className="w-3 h-3" />
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white text-sm">
                      <Star className="w-3 h-3" fill="white" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Dr. {doctor.name}</h3>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <CheckCircle className="w-3 h-3 text-primary" />
                  <span>{doctor.speciality}</span>
                  <span className="text-xs">•</span>
                  <span>{doctor.degree}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>
  {doctor.address.line1}
  {doctor.address.line2 && `, ${doctor.address.line2}`}
</span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm font-medium text-primary">
                    Fees: ₹{doctor.fees}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/appointment/${doctor._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-primary group-hover:underline transition-all"
                  >
                    Book Now
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* "View All" Button */}
        <div className="flex justify-center mt-12">
          <button 
            onClick={() => {
              navigate('/doctors');
              window.scrollTo(0, 0);
            }}
            className="px-8 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors duration-300 shadow-md flex items-center gap-2"
          >
            View All Doctors
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;  