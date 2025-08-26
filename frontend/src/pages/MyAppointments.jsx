// src/pages/MyAppointments.jsx
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const MyAppointments = () => {
  const { backendUrl, token ,userData} = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [payment, setPayment] = useState('')

  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ]
  const formatDate = (slotDate) => {
    const [d, m, y] = slotDate.split('_')
    return `${d} ${months[Number(m)]} ${y}`
  }

  const load = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        { headers: { token } }
      )
      setAppointments(data.appointments.reverse())
    } catch (e) {
      toast.error(e.message)
    }
  }

  const cancelAppointment = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId: id },
        { headers: { token } }
      )
      data.success ? (toast.success(data.message), load()) : toast.error(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',
            response,
            { headers: { token } }
          )
          if (data.success) (navigate('/my-appointments'), load())
        } catch (e) { toast.error(e.message) }
      },
    }
    new window.Razorpay(options).open()
  }

const handleAddReview = async (item) => {
  const comment = prompt("Leave a comment about your experience:");
  const star = Number(prompt("Rate the doctor (1-5):"));

  if (!comment || !star || star < 1 || star > 5) {
    toast.error("Please provide a valid comment and star rating (1-5)");
    return;
  }

  try {
    const { data } = await axios.post(
      backendUrl + "/api/user/add-comment",
      {
        docId: item.docData._id,
        userId:userData.id,
        comment,
        star
      },
      { headers: { token } }
    );

    if (data.success) {
      toast.success("Review submitted");
      load(); // reload appointments to hide button
    } else {
      toast.error(data.message);
    }
  } catch (e) {
    toast.error(e.message);
  }
};






  const appointmentRazorpay = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay',
        { appointmentId: id },
        { headers: { token } }
      )
      data.success ? initPay(data.order) : toast.error(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const appointmentStripe = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-stripe',
        { appointmentId: id },
        { headers: { token } }
      )
      data.success ? window.location.replace(data.session_url) : toast.error(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  useEffect(() => {
    if (token) load()
  }, [token])

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 dark:text-gray-400 border-b">
        My appointments
      </p>
      <div>
        {appointments.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            <img
              className="w-36 bg-[#EAEFFF] rounded-lg"
              src={item.docData.image}
              alt=""
            />
            <div className="flex-1 text-sm text-[#5E5E5E] dark:text-gray-300">
              <p className="text-[#262626] dark:text-gray-100 text-base font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-[#464646] dark:text-gray-400 font-medium mt-1">
                Address:
              </p>
              <p>{item.docData.address.line1}</p>
              <p>{item.docData.address.line2}</p>
              <p className="mt-1">
                <span className="text-sm text-[#3C3C3C] dark:text-gray-400 font-medium">
                  Date & Time:
                </span>{' '}
                {formatDate(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                <button
                  onClick={() => setPayment(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded
                             hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                <>
                  <button
                    onClick={() => appointmentStripe(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded
                               hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <img className="max-w-20 max-h-5" src={assets.stripe_logo} alt="" />
                  </button>
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded
                               hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <img className="max-w-20 max-h-5" src={assets.razorpay_logo} alt="" />
                  </button>
                </>
              )}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]">
                  Paid
                </button>
              )}
             {item.isCompleted && (
  <>
    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
      Completed
    </button>
    {!item.reviewed && (
      <button
        onClick={() => handleAddReview(item)}
        className="sm:min-w-48 py-2 border rounded text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
      >
        Add Review
      </button>
    )}
  </>
)}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded
                             hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
