import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
     const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available,
                weeklyAvailability: profileData.weeklyAvailability,
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }




const addSlot = (day) => {
  setProfileData(prev => {
    const updated = { ...prev.weeklyAvailability };
    if (!updated[day]) updated[day] = [];
    updated[day].push({ start: "", end: "" });
    return { ...prev, weeklyAvailability: updated };
  });
};

const updateSlot = (day, index, key, value) => {
  setProfileData(prev => {
    const updated = { ...prev.weeklyAvailability };
    updated[day][index][key] = value;
    return { ...prev, weeklyAvailability: updated };
  });
};

const removeSlot = (day, index) => {
  setProfileData(prev => {
    const updated = { ...prev.weeklyAvailability };
    updated[day].splice(index, 1);
    return { ...prev, weeklyAvailability: updated };
  });
};








    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About :</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {
                                isEdit
                                    ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} type='text' className='w-full outline-primary p-2' rows={8} value={profileData.about} />
                                    : profileData.about
                            }
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-800'>{currency} {isEdit ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}</span>
                    </p>

                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <p className='text-sm'>
                            {isEdit ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} /> : profileData.address.line1}
                            <br />
                            {isEdit ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} /> : profileData.address.line2}
                        </p>
                    </div>

                    <div className='flex gap-1 pt-2'>
                        <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                        <label htmlFor="">Available</label>
                    </div>



                    

                    <div className="mt-6">
  <p className='font-medium text-lg text-gray-700 mb-2'>Weekly Availability:</p>
  {weekdays.map(day => (
    <div key={day} className='mb-4'>
      <div className='flex items-center gap-4 mb-1'>
        <p className='w-24 font-medium'>{day}</p>
        {isEdit && (
          <button type="button" onClick={() => addSlot(day)} className='text-sm text-blue-500 underline'>Add Slot</button>
        )}
      </div>

      {(profileData.weeklyAvailability?.[day] || []).map((slot, index) => (
        <div key={index} className='flex items-center gap-2 mb-1 ml-6'>
          <input
            type="time"
            value={slot.start}
            onChange={(e) => updateSlot(day, index, 'start', e.target.value)}
            disabled={!isEdit}
            className='border px-2 py-1 rounded'
          />
          <span>-</span>
          <input
            type="time"
            value={slot.end}
            onChange={(e) => updateSlot(day, index, 'end', e.target.value)}
            disabled={!isEdit}
            className='border px-2 py-1 rounded'
          />
          {isEdit && (
            <button onClick={() => removeSlot(day, index)} type="button" className='text-red-500 text-xs ml-2'>Remove</button>
          )}
        </div>
      ))}
    </div>
  ))}
</div>







                    {
                        isEdit
                            ? <button onClick={updateProfile} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Save</button>
                            : <button onClick={() => setIsEdit(prev => !prev)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'>Edit</button>
                    }

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile