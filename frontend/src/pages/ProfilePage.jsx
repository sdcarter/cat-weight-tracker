import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';
import UserMenu from '../components/UserMenu';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Cat Weight Tracker</h1>
            <p className="text-sm opacity-90">User Profile</p>
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
          <ProfileForm />
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Cat Weight Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;