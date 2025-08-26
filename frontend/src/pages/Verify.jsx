// src/pages/Verify.jsx
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const appointmentId = searchParams.get('appointmentId')
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/user/verifyStripe',
          { success, appointmentId },
          { headers: { token } }
        )
        data.success ? toast.success(data.message) : toast.error(data.message)
        navigate('/my-appointments')
      } catch (e) {
        toast.error(e.message)
      }
    }
    if (token && appointmentId && success) verify()
  }, [backendUrl, token, appointmentId, success, navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center
                    bg-white dark:bg-gray-900">
      <div className="w-20 h-20 border-4 border-gray-300 dark:border-gray-700
                      border-t-4 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default Verify
