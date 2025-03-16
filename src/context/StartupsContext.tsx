
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { StartupListItem } from '@/components/StartupList';

type StartupsContextType = {
  startups: StartupListItem[];
  setStartups: React.Dispatch<React.SetStateAction<StartupListItem[]>>;
  addStartups: (newStartups: StartupListItem[]) => void;
  clearStartups: () => void;
  getMetricColumns: () => string[];
};

const defaultValue: StartupsContextType = {
  startups: [],
  setStartups: () => {},
  addStartups: () => {},
  clearStartups: () => {},
  getMetricColumns: () => [],
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

  // Get all metric columns from startups (excluding name and sector)
  const getMetricColumns = (): string[] => {
    if (startups.length === 0 || !startups[0].originalData) return [];
    
    // Get all unique column names from all startups
    const allColumns = new Set<string>();
    startups.forEach(startup => {
      if (startup.originalData) {
        Object.keys(startup.originalData).forEach(key => {
          if (!key.includes('name') && !key.includes('startup') && 
              !key.includes('sector') && !key.includes('industry')) {
            allColumns.add(key);
          }
        });
      }
    });
    
    return Array.from(allColumns);
  };

  return (
    <StartupsContext.Provider value={{ 
      startups, 
      setStartups, 
      addStartups, 
      clearStartups,
      getMetricColumns
    }}>
      {children}
    </StartupsContext.Provider>
  );
};

export default StartupsContext;
