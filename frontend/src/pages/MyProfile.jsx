// src/pages/MyProfile.jsx
import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)
  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext)

  const updateUser = async () => {
    const form = new FormData()
    form.append('name', userData.name)
    form.append('phone', userData.phone)
    form.append('address', JSON.stringify(userData.address))
    form.append('gender', userData.gender)
    form.append('dob', userData.dob)
    if (image) form.append('image', image)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        form,
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(null)
      } else toast.error(data.message)
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (!userData) return null
  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5
                    bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt=""
            />
            <img className="w-10 absolute bottom-12 right-12" src={assets.upload_icon} alt="" />
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="" />
      )}

      {isEdit ? (
        <input
          className="bg-gray-50 dark:bg-gray-700 text-3xl font-medium max-w-60 text-black dark:text-white"
          type="text"
          onChange={(e) =>
            setUserData((p) => ({ ...p, name: e.target.value }))
          }
          value={userData.name}
        />
      ) : (
        <p className="font-medium text-3xl mt-4">{userData.name}</p>
      )}

      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      <div>
        <p className="text-gray-600 dark:text-gray-400 underline mt-3">
          CONTACT INFORMATION
        </p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636] dark:text-gray-300">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-50 dark:bg-gray-700 max-w-52 text-black dark:text-white"
              type="text"
              onChange={(e) =>
                setUserData((p) => ({ ...p, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div>
              <input
                className="bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
                type="text"
                onChange={(e) =>
                  setUserData((p) => ({
                    ...p,
                    address: { ...p.address, line1: e.target.value },
                  }))
                }
                value={userData.address.line1}
              />
              <br />
              <input
                className="bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
                type="text"
                onChange={(e) =>
                  setUserData((p) => ({
                    ...p,
                    address: { ...p.address, line2: e.target.value },
                  }))
                }
                value={userData.address.line2}
              />
            </div>
          ) : (
            <p>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-[#797979] dark:text-gray-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600 dark:text-gray-400">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="bg-gray-50 dark:bg-gray-700 text-black dark:text-white max-w-20"
              onChange={(e) =>
                setUserData((p) => ({ ...p, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option>Not Selected</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="bg-gray-50 dark:bg-gray-700 text-black dark:text-white max-w-28"
              type="date"
              onChange={(e) =>
                setUserData((p) => ({ ...p, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p>{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUser}
            className="border border-primary px-8 py-2 rounded-full
                       hover:bg-primary hover:text-white transition-all"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full
                       hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile
