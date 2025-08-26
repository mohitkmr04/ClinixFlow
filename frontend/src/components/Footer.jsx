import React, { useContext } from 'react';          // ← useContext added
import { assets } from '../assets/assets';
import { ThemeContext } from '../context/ThemeContext'; // ← ThemeContext added

const Footer = () => {
  const { theme } = useContext(ThemeContext);       // theme now defined

  /* DON’T break the return line — open the parenthesis immediately */
  return (
    <footer className="md:mx-10 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* logo & copy */}
        <div>
          <img
            src={theme === 'dark' ? assets.logo_dark : assets.logo}
            alt="Logo"
            className="mb-5 w-40"
          />
          <p className="w-full md:w-2/3 leading-6">
            Lorem Ipsum is simply dummy text
          </p>
        </div>

        {/* company links */}
        <div>
          <p className="text-xl font-medium mb-5 dark:text-white">COMPANY</p>
          <ul className="flex flex-col gap-2">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* contact */}
        <div>
          <p className="text-xl font-medium mb-5 dark:text-white">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />
      <p className="py-5 text-sm text-center">
        © 2024 Prescripto.com — All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
