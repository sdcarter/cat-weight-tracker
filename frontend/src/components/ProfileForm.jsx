import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/api';

const ProfileForm = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUpdating(true);

    try {
      const response = await axios.put(`${API_URL}/auth/me`, {
        username: username !== user.username ? username : undefined,
        email: email !== user.email ? email : undefined
      });

      setUser(response.data);
      setSuccess(t('messages.profileUpdated'));
      toast({
        title: t('common.success'),
        description: t('messages.profileUpdated'),
        variant: 'success'
      });
    } catch (error) {
      setError(error.response?.data?.detail || t('messages.profileUpdateFailed'));
      toast({
        title: t('common.error'),
        description: error.response?.data?.detail || t('messages.profileUpdateFailed'),
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError(t('messages.passwordsDoNotMatch'));
      return;
    }

    setIsChangingPassword(true);

    try {
      await axios.put(`${API_URL}/auth/me/password`, {
        current_password: currentPassword,
        new_password: newPassword
      });

      setSuccess(t('messages.passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: t('common.success'),
        description: t('messages.passwordChanged'),
        variant: 'success'
      });
    } catch (error) {
      setError(error.response?.data?.detail || t('messages.passwordChangeFailed'));
      toast({
        title: t('common.error'),
        description: error.response?.data?.detail || t('messages.passwordChangeFailed'),
        variant: 'destructive'
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('profile.settings')}</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">{t('auth.username')}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? t('common.updating') : t('profile.updateProfile')}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('profile.changePassword')}</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('auth.currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('auth.newPassword')}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isChangingPassword}>
            {isChangingPassword ? t('common.changing') : t('profile.changePassword')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfileForm;