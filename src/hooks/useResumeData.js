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
        const sorted = {
          ...staticResumeData,
          projects: [...(staticResumeData.projects || [])].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)),
          workExperience: [...(staticResumeData.workExperience || [])].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)),
          skills: [...(staticResumeData.skills || [])].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)),
          education: [...(staticResumeData.education || [])].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)),
        };
        setResumeData(sorted);
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
