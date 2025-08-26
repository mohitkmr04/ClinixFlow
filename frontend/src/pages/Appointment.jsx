import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  Calendar, 
  Clock, 
  Info, 
  Star, 
  CheckCircle, 
  Award, 
  Stethoscope, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Heart
} from 'lucide-react'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
    useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(false)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('appointment')
  const [favorite, setFavorite] = useState(false)
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate()

  const fetchDocInfo = () => {
    const info = doctors.find((d) => d._id === docId)
    setDocInfo(info)
  }

const getAvailableSlots = () => {
  const availability = docInfo.weeklyAvailability;
  if (!availability) return;

  const today = new Date();
  const slots = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    if (availability[dayName] && availability[dayName].length > 0) {
      const daySlots = availability[dayName].map(slot => {
        const [startHour, startMinute] = slot.start.split(':').map(Number);
        const [endHour, endMinute] = slot.end.split(':').map(Number);

        const slotStartDateTime = new Date(date);
        slotStartDateTime.setHours(startHour, startMinute, 0, 0);

        const slotEndDateTime = new Date(date);
        slotEndDateTime.setHours(endHour, endMinute, 0, 0);

        const startTime = slotStartDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = slotEndDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
          datetime: new Date(slotStartDateTime),
          time: `${startTime} - ${endTime}`
        };
      });

      slots.push(daySlots);
    }
  }

  setDocSlots(slots);
};




const fetchReviews = async () => {
  try {
    console.log("called review function")
    const { data } = await axios.get(`${backendUrl}/api/doctor/reviews/${docId}`,{ headers: { token } });
    if (data.success) {
      setReviews(data.comments);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};




  const book = async () => {
    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
    }
    if (!slotTime) {
      toast.warning('Please select a time slot')
      return
    }
    
    setIsLoading(true)
    const date = docSlots[slotIndex][0].datetime
    const d = date.getDate(),
      m = date.getMonth() + 1,
      y = date.getFullYear()
    const slotDate = `${d}_${m}_${y}`
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getDoctosData()
        navigate('/my-appointments')
      } else toast.error(data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
    }
  }
  

  useEffect(() => {
    if (doctors.length) fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo){
getAvailableSlots();
fetchReviews()

    } 
  }, [docInfo])

  const getDateString = (date) => {
    const options = { month: 'short', day: 'numeric' }
    return date?.toLocaleDateString('en-US', options)
  }
console.log(reviews)
  if (!docInfo) return (
    <div className="flex flex-col justify-center items-center h-96 gap-4">
      <div className="animate-pulse w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading doctor profile...</p>
    </div>
  )

  return (
    <div className="dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Hero Section with Doctor Profile */}
<div className="relative bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 h-64 md:h-72 rounded-2xl">
        <div className="absolute inset-0 bg-[url('https://api.placeholder.com/800/600')] mix-blend-overlay opacity-10 bg-center bg-cover"></div>
        <div className="max-w-7xl mx-auto px-4 h-full">
          <div className="flex items-end h-full pb-16">
            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <img
                  src={docInfo.image}
                  alt={docInfo.name}
                  className="w-36 h-36 object-cover rounded-2xl border-4 border-white shadow-xl"
                />
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{docInfo.name}</h1>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Stethoscope className="w-4 h-4" />
                    <span>{docInfo.speciality}</span>
                  </div>
                  <div className="h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{docInfo.degree}</span>
                  </div>
                  <div className="h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" fill="white" />
                    <span>4.9 (180+)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <MapPin className="w-3 h-3" />
                    <span className="text-sm">New York Medical Center</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm ml-2">
                    <span className="text-sm font-medium">{docInfo.experience}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Details Column */}
          <div className="w-full md:w-1/3">
            {/* Doctor Image (Mobile) */}
            <div className="md:hidden flex justify-center -mt-20 mb-6">
              <img
                src={docInfo.image}
                alt={docInfo.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl"
              />
            </div>

            {/* Doctor Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                {/* Action Buttons */}
                <div className="flex justify-between mb-6">
                  <button 
                    onClick={() => setFavorite(!favorite)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      favorite 
                        ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm font-medium">Favorite</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </button>
                </div>

                {/* Consultation Fee */}
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Consultation Fee</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                        {currencySymbol}{docInfo.fees}
                      </p>
                    </div>
                    <button
                      onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Doctor Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium">{docInfo.name.toLowerCase().replace(/\s+/g, '.')}@medicenter.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium">New York Medical Center</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Board Certified</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Certified by the American Board of Medical Specialties
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Top Doctor 2024</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Recognized among the top specialists in the field
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 mt-1 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Patient Choice Award</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Awarded for exceptional patient care and satisfaction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="w-full md:w-2/3">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('appointment')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'appointment'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'about'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  About Doctor
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'appointment' && (
                  <div id="booking-section">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Select Appointment Date & Time
                    </h2>
                    
                    {/* Date Selection */}
                    <div className="mb-8">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Select Date</p>
                      <div className="flex gap-3 items-center w-full overflow-x-auto pb-2 scrollbar-hide">
                        {docSlots?.map((daySlots, i) => (
                          <div
                            key={i}
                            onClick={() => setSlotIndex(i)}
                            className={`text-center py-4 px-3 min-w-20 cursor-pointer transition-all ${
                              slotIndex === i
                                ? 'bg-primary text-white rounded-xl shadow-md shadow-primary/30 scale-105 transform'
                                : 'border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 bg-white dark:bg-gray-800 rounded-xl hover:shadow-sm'
                            }`}
                          >
                            <p className="text-xs font-medium mb-1">{daySlots?.[0]?.datetime
  ? <p className="text-xs font-medium mb-1">
      {daysOfWeek[new Date(daySlots[0]?.datetime).getDay()]}
    </p>
  : <p className="text-xs font-medium mb-1 text-gray-400">N/A</p>}</p>
                            <p className="text-lg font-bold">{daySlots[0]?.datetime?.getDate()}</p>
                            <p className="text-xs mt-1">{getDateString(daySlots[0]?.datetime)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Time Selection */}
                    <div className="mb-8">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Available Time Slots
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {docSlots[slotIndex]?.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => setSlotTime(s.time)}
                            className={`py-3 px-2 rounded-xl text-center transition-all ${
                              s.time === slotTime
                                ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105 transform'
                                : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                            }`}
                          >
                            {s.time.toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Book Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={book}
                        disabled={isLoading || !slotTime}
                        className={`
                          px-8 py-3 rounded-xl font-medium text-white shadow-lg
                          flex items-center gap-2 transition-all
                          ${isLoading 
                            ? 'bg-gray-400 cursor-wait' 
                            : slotTime 
                              ? 'bg-primary hover:bg-primary/90 shadow-primary/30' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Book Appointment
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">About Dr. {docInfo.name.split(' ')[0]}</h2>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{docInfo.about}</p>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Dr. {docInfo.name} is a {docInfo.speciality} specialist with {docInfo.experience} of professional experience.
                        They've completed their {docInfo.degree} and continued to enhance their skills through ongoing
                        education and specialized training in the field.
                      </p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Education & Training</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                        <li>{docInfo.degree} - Medical University</li>
                        <li>Residency in {docInfo.speciality} - General Hospital</li>
                        <li>Fellowship in Advanced {docInfo.speciality} - Medical Research Center</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Specializations</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                        <li>General {docInfo.speciality}</li>
                        <li>Advanced Diagnostic Procedures</li>
                        <li>Minimally Invasive Treatments</li>
                        <li>Preventive Care</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold">Patient Reviews</h2>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" />
          ))}
        </div>
        <span className="font-medium">{
          (reviews.length 
            ? (reviews.reduce((sum, r) => sum + r.star, 0) / reviews.length).toFixed(1)
            : "0.0"
          )
        }</span>
        <span className="text-gray-500 dark:text-gray-400">
          ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
        </span>
      </div>
    </div>

    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      ) : (
        reviews.map((review, idx) => (
          <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="font-medium">{review.userName?.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 text-yellow-500"
                    fill={star <= review.star ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  </div>
)}

              </div>
            </div>

            {/* Related Doctors Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Other {docInfo.speciality} Specialists</h3>
              <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment