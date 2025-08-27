// src/pages/Contact.jsx
import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="text-center text-2xl pt-10 text-[#707070] dark:text-gray-300">
        <p>
          CONTACT <span className="text-gray-700 font-semibold dark:text-gray-100">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px] rounded-lg"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">
            OUR OFFICE
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Tel: (415) 555-0132 <br /> Email: greatstackdev@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">
            CAREERS AT ClinixFlow
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black dark:border-gray-700 px-8 py-4 text-sm
                             hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
