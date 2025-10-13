import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

function Header() {
  return (
    <nav className="bg-gray-100 border-b-2 border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <img src={logo} height={80} className="h-20" alt="RollCall Logo" />
            <span className="font-bold text-2xl ml-3 ">RollCall - Attendance Management</span>
          </div>
          <div>
            <Link to="/student" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
              Student
            </Link>
            <Link to="/faculty" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-lg font-medium">
              Faculty
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
