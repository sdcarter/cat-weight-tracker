import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { registrationEnabled } = useAuth();

  const toggleForm = () => {
    // Only allow toggling to registration if it's enabled
    if (showLogin && !registrationEnabled) {
      return;
    }
    setShowLogin(!showLogin);
    setRegistrationSuccess(false);
  };

  // If registration is disabled and we're on the register form, switch to login
  useEffect(() => {
    if (!registrationEnabled && !showLogin) {
      setShowLogin(true);
    }
  }, [registrationEnabled, showLogin]);

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {registrationSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Registration successful! Please log in.
          </div>
        )}
        
        {!registrationEnabled && !showLogin && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Registration is currently disabled. Please contact the administrator.
          </div>
        )}
        
        {showLogin ? (
          <LoginForm onToggleForm={registrationEnabled ? toggleForm : null} />
        ) : (
          <RegisterForm 
            onToggleForm={toggleForm} 
            onSuccess={handleRegistrationSuccess} 
          />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;