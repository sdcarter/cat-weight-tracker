import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant={i18n.language === 'en' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => changeLanguage('en')}
      >
        EN
      </Button>
      <Button 
        variant={i18n.language === 'de' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => changeLanguage('de')}
      >
        DE
      </Button>
    </div>
  );
};

export default LanguageSwitcher;