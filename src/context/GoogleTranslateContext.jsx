// src/context/GoogleTranslateContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import googleTranslateService from '../services/googleTranslateService';

const GoogleTranslateContext = createContext();

export const useGoogleTranslate = () => {
  const context = useContext(GoogleTranslateContext);
  if (!context) {
    throw new Error('useGoogleTranslate must be used within GoogleTranslateProvider');
  }
  return context;
};

export const GoogleTranslateProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const init = async () => {
      const success = await googleTranslateService.init();
      setIsInitialized(success);
      googleTranslateService.showTranslateBar(false);
      
      // Listen for language changes
      window.addEventListener('languageChanged', (event) => {
        setCurrentLanguage(event.detail.language);
        setIsTranslating(false);
      });
    };
    
    init();
    
    return () => {
      googleTranslateService.destroy();
    };
  }, []);

  const changeLanguage = async (languageCode) => {
    if (!isInitialized) return false;
    
    setIsTranslating(true);
    const success = await googleTranslateService.changeLanguage(languageCode);
    
    if (success) {
      setCurrentLanguage(languageCode);
    }
    
    setTimeout(() => setIsTranslating(false), 1000);
    return success;
  };

  const value = {
    currentLanguage,
    isInitialized,
    isTranslating,
    changeLanguage
  };

  return (
    <GoogleTranslateContext.Provider value={value}>
      {children}
    </GoogleTranslateContext.Provider>
  );
};