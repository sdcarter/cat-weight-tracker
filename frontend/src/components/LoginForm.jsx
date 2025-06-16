import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

const LoginForm = ({ onToggleForm }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t('auth.login')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
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
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {t('auth.login')}
        </Button>
      </form>
      {onToggleForm && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-primary hover:underline"
            >
              {t('auth.register')}
            </button>
          </p>
        </div>
      )}
    </Card>
  );
};

export default LoginForm;