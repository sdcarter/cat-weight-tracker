import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthScreen = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setRegistrationSuccess(false);
  };

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
        
        {showLogin ? (
          <LoginForm onToggleForm={toggleForm} />
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