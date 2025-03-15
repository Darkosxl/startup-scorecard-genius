
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { StartupListItem } from '@/components/StartupList';

type StartupsContextType = {
  startups: StartupListItem[];
  setStartups: React.Dispatch<React.SetStateAction<StartupListItem[]>>;
  addStartups: (newStartups: StartupListItem[]) => void;
  clearStartups: () => void;
};

const defaultValue: StartupsContextType = {
  startups: [],
  setStartups: () => {},
  addStartups: () => {},
  clearStartups: () => {},
};

const StartupsContext = createContext<StartupsContextType>(defaultValue);

export const useStartups = () => useContext(StartupsContext);

type StartupsProviderProps = {
  children: ReactNode;
};

export const StartupsProvider: React.FC<StartupsProviderProps> = ({ children }) => {
  const [startups, setStartups] = useState<StartupListItem[]>([]);

  // Load startups from localStorage on initial render
  useEffect(() => {
    const savedStartups = localStorage.getItem('uploadedStartups');
    if (savedStartups) {
      try {
        const parsedStartups = JSON.parse(savedStartups);
        if (Array.isArray(parsedStartups)) {
          setStartups(parsedStartups);
        }
      } catch (error) {
        console.error('Error loading startups data:', error);
      }
    }
  }, []);

  // Save startups to localStorage whenever they change
  useEffect(() => {
    if (startups.length > 0) {
      localStorage.setItem('uploadedStartups', JSON.stringify(startups));
    }
  }, [startups]);

  const addStartups = (newStartups: StartupListItem[]) => {
    setStartups(prev => [...prev, ...newStartups]);
  };

  const clearStartups = () => {
    setStartups([]);
    localStorage.removeItem('uploadedStartups');
  };

  return (
    <StartupsContext.Provider value={{ startups, setStartups, addStartups, clearStartups }}>
      {children}
    </StartupsContext.Provider>
  );
};

export default StartupsContext;
