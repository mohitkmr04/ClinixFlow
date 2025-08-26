// src/pages/Login.jsx
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { useLocation } from 'react-router-dom'

const Login = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const location = useLocation()
  // Determine initial mode from path
  const isRegisterPage = location.pathname === '/register'
  const [state, setState] = useState(isRegisterPage ? 'Sign Up' : 'Login')

  const onSubmit = async (e) => {
    e.preventDefault()
    const url =
      state === 'Sign Up'
        ? '/api/user/register'
        : '/api/user/login'
    const { data } = await axios.post(backendUrl + url, {
      ...(state === 'Sign Up' && { name }),
      email,
      password,
    })
    if (data.success) {
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } else toast.error(data.message)
  }

  useEffect(() => {
    setState(location.pathname === '/register' ? 'Sign Up' : 'Login')
  }, [location.pathname])

  useEffect(() => {
    if (token) navigate('/')
  }, [token])

  return (
    <form
      onSubmit={onSubmit}
      className="min-h-[80vh] flex items-center bg-white dark:bg-gray-900"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96
                      border rounded-xl text-[#5E5E5E] dark:text-gray-300
                      bg-white dark:bg-gray-800 text-sm shadow-lg">
        <p className="text-2xl font-semibold dark:text-white">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-[#DADADA] rounded w-full p-2 mt-1 bg-white dark:bg-gray-700 text-black"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 bg-white dark:bg-gray-700 text-black"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 bg-white dark:bg-gray-700 text-black"
            type="password"
            required
          />
        </div>
        <button className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login
