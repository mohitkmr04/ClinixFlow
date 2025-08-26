import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="py-16 px-4  dark:bg-gray-900 text-gray-800 dark:text-gray-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">
            Find by Speciality
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400">
            Simply browse through our extensive list of trusted doctors, schedule your
            appointment hassle-free.
          </p>
        </div>

        {/* Speciality Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {specialityData.map((item, index) => (
            <Link
              key={index}
              to={`/doctors/${item.speciality}`}
              onClick={() => window.scrollTo(0, 0)}
              className="group flex flex-col items-center cursor-pointer hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative mb-3">
                {/* Circle background */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full dark:bg-blue-900/20 flex items-center justify-center group-hover:shadow-md group-hover:shadow-primary/20 transition-all">
                  <img 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain" 
                    src={item.image} 
                    alt={item.speciality}
                  />
                </div>
                
                {/* Hover indicator dot */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform"></div>
              </div>
              
              <p className="text-center text-sm font-medium dark:text-white">
                {item.speciality}
              </p>
              
              <div className="flex items-center text-primary text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Doctors</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </Link>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default SpecialityMenu;