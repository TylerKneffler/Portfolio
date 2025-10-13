import { useState, useEffect } from 'react';
import { resumeData as staticResumeData } from '../assets/data/resumeData';

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: null,
    workExperience: [],
    education: [],
    projects: [],
    skills: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStaticResumeData();
  }, []);

  const loadStaticResumeData = () => {
    try {
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        setResumeData(staticResumeData);
        setLoading(false);
      }, 100);
    } catch (err) {
      setError('Failed to load resume data');
      console.error('Error loading resume data:', err);
      setLoading(false);
    }
  };

  return { resumeData, loading, error, refetch: loadStaticResumeData };
};
