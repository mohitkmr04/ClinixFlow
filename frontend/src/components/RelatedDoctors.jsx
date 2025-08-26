import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { CheckCircle, Star, MapPin } from 'lucide-react';

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relatedDoctors, setRelatedDoctors] = useState([]);

  useEffect(() => {
    if (doctors.length && speciality) {
      // Filter doctors with the same speciality but exclude the current doctor
      setRelatedDoctors(doctors.filter(d => d.speciality === speciality && d._id !== docId).slice(0, 3));
    }
  }, [doctors, speciality, docId]);

  if (relatedDoctors.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {relatedDoctors.map((doctor) => (
        <div
          key={doctor._id}
          onClick={() => {
            navigate(`/appointment/${doctor._id}`);
            window.scrollTo(0, 0);
          }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
        >
          <div className="relative">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-40 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className={`text-xs font-medium text-white`}>
                  {doctor.available ? 'Available Now' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800 dark:text-white">Dr. {doctor.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span className="text-xs font-medium">4.8</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <CheckCircle className="w-3 h-3 text-primary" />
              <span>{doctor.speciality}</span>
              <span>•</span>
              <span>{doctor.degree}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>New York Medical Center</span>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/appointment/${doctor._id}`);
                window.scrollTo(0, 0);
              }}
              className="w-full mt-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedDoctors;