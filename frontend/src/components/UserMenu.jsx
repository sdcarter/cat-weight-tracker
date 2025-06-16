import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="hidden md:block">
        <span className="text-sm text-gray-700">Welcome, {user.username}</span>
      </div>
      <div className="relative">
        <Button
          variant="ghost"
          className="flex items-center space-x-1"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={(e) => {
            // Only close if focus doesn't move to an element inside the dropdown
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsOpen(false);
            }
          }}
        >
          <span>Account</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;