// Static settings for the simplified portfolio site
const staticSettings = {
  allowRegistration: false,
  siteName: 'KirbySucks Portfolio',
  siteDescription: 'Personal portfolio and creative showcase',
  resumePublic: true,
  maintenanceMode: false,
  emailNotifications: false
};

export const usePublicSettings = () => {
  return { 
    settings: staticSettings, 
    loading: false, 
    error: null 
  };
};
