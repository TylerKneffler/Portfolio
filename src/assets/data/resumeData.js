// Static resume data extracted from database
export const resumeData = {
  personalInfo: {
    fullName: 'Tyler Kneffler',
    title: 'Software Developer and Engineer',
    email: 'KnefflerTyler@gmail.com',
    phone: '(330) 447-1238',
    location: 'Dover, OH',
    linkedinUrl: null,
    githubUrl: null,
    summary: 'Software Developer and Engineer with expertise in full-stack web, mobile, and custom applications. Skilled in cloud infrastructure on AWS and Azure, with a focus on scalability, performance, and reliability. Strong background in Agile development, and cross-platform application development.'
  },

  workExperience: [
    {
      id: 1,
      company: 'RMR Development',
      position: 'Software Developer and Engineer',
      location: 'Dover, OH',
      startDate: 'May 2022',
      endDate: null,
      isCurrent: true,
      responsibilities: [
        'Develop, administer, and maintain full-stack web, mobile, and custom applications with an emphasis on scalability and performance',
        'Configure and support cloud infrastructure on AWS (EC2, RDS, S3) and Azure, including deployment, scaling, and monitoring',
        'Design and debug software in Linux-based environments, leveraging shell scripting and OS-level tools to ensure system stability',
        'Integrate RESTful APIs and system interfaces to enable secure communication between multi-platform environments',
        'Built and maintained CI/CD pipelines with GitHub Actions, including automated testing and deployment workflows',
        'Collaborate in Agile teams with Git-based branching strategies, code reviews, and detailed documentation',
        'Apply logging, monitoring, and automated testing practices to support compliance and reliability'
      ],
      sortOrder: 1
    },
    {
      id: 2,
      company: 'The Ohio State University',
      position: 'Student Tech Assistant',
      location: 'Columbus, OH',
      startDate: 'August 2020',
      endDate: 'May 2022',
      isCurrent: false,
      responsibilities: [
        'Supported and repaired campus learning space technology, including A/V systems, networking, and classroom IT equipment',
        'Responded to incident tickets and provided hands-on technical assistance for faculty, staff, and students',
        'Documented troubleshooting procedures and trained new staff to ensure consistent IT support coverage'
      ],
      sortOrder: 2
    },
    {
      id: 3,
      company: 'RMR Development',
      position: 'Web Development Intern',
      location: 'Dover, OH',
      startDate: 'May 2019',
      endDate: 'August 2019',
      isCurrent: false,
      responsibilities: [
        'Developed, customized, and maintained WordPress websites, ensuring security, usability, and accessibility compliance',
        'Performed performance tuning, patching, and updates to ensure reliable system operation'
      ],
      sortOrder: 3
    }
  ],

  education: [
    {
      id: 1,
      institution: 'The Ohio State University',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science and Engineering',
      location: 'Columbus, OH',
      graduationYear: '2022',
      additionalInfo: 'H2O – Student Organization',
      sortOrder: 1
    },
    {
      id: 2,
      institution: 'New Philadelphia High School',
      degree: 'High School Diploma',
      fieldOfStudy: null,
      location: 'New Philadelphia, OH',
      graduationYear: '2018',
      additionalInfo: 'Marching Band, Concert Band, Steel Drum Band, Indoor Percussion Ensemble, and Project Lead the Way',
      sortOrder: 2
    }
  ],

  projects: [
    {
      id: 1,
      name: 'Radar-Inspired Aircraft Path Simulation',
      description: 'Processed and visualized aircraft flight paths, simulating live radar tracking',
      technologies: ['C'],
      highlights: [
        'Processed and visualized aircraft flight paths',
        'Simulated live radar tracking functionality'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: null,
      year: null,
      sortOrder: 1
    },
    {
      id: 2,
      name: 'Warehouse Packaging and Employee Management App',
      description: 'Built a cross-platform app with real-time database integration, workstation logging, and productivity monitoring',
      technologies: ['Xamarin', '.NET MAUI'],
      highlights: [
        'Cross-platform application development',
        'Real-time database integration',
        'Workstation logging capabilities',
        'Productivity monitoring features'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: null,
      year: null,
      sortOrder: 2
    },
    {
      id: 3,
      name: 'WordPress Gift Card Plugin',
      description: 'Developed secure plugin with bulk card management, PDF generation, and role-based access controls',
      technologies: ['PHP', 'JavaScript', 'HTML'],
      highlights: [
        'Secure plugin development',
        'Bulk card management functionality',
        'PDF generation capabilities',
        'Role-based access controls implementation'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/assets/uploads/giftcardplugin.png',
      year: null,
      sortOrder: 3
    },
    {
      id: 4,
      name: 'TimeCard App & Administrative Site',
      description: 'Built a real-time geolocation and geofencing system to track user locations and trigger location-based events with precision',
      technologies: ['ASP.NET', '.NET MAUI'],
      highlights: [
        'Real-time geolocation tracking',
        'Geofencing system implementation',
        'Location-based event triggers',
        'Precision location tracking'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/assets/uploads/TimeCardApp.png',
      year: null,
      sortOrder: 4
    },
    {
      id: 5,
      name: 'AEV (Advanced Energy Vehicle)',
      description: 'Collaborated on the design and testing of an energy-efficient autonomous vehicle. Conducted evaluations and optimizations documented at OSU',
      technologies: ['Hardware/Software Integration'],
      highlights: [
        'Energy-efficient vehicle design',
        'Autonomous vehicle systems',
        'Performance evaluations and optimizations',
        'Hardware/software integration experience',
        'Power efficiency optimization',
        'System iteration and testing'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/assets/uploads/AEVData.png',
      year: null,
      sortOrder: 5
    },
    {
      id: 6,
      name: 'Game Development Projects',
      description: 'Developed various game projects including platformers and interactive experiences using game development frameworks',
      technologies: ['Unity', 'C#', 'Game Development'],
      highlights: [
        'Platform game mechanics implementation',
        'Character controller systems',
        'Game state management',
        'Interactive gameplay features'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/assets/uploads/kirby-gameplay.gif',
      year: null,
      sortOrder: 6
    }
  ],

  skills: [
    {
      id: 1,
      category: 'Full Stack Development',
      items: [
        { name: 'Full Stack Development', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Object-Oriented Programming (OOP)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'API Integration (RESTful Services)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
        { name: 'Debugging & Optimization', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' }
      ],
      sortOrder: 1
    },
    {
      id: 2,
      category: 'Web & Mobile Development',
      items: [
        { name: 'WordPress Development (Websites, Plugins, Custom Features)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg' },
        { name: '.NET Development (ASP.NET, .NET MAUI, Xamarin)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
        { name: 'Mobile App Development (Native & Cross-Platform)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
        { name: 'Game Development (Unity, Unreal Engine)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg' }
      ],
      sortOrder: 2
    },
    {
      id: 3,
      category: 'Database & Cloud',
      items: [
        { name: 'Database Design & Management (SQL)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Cloud Deployment (AWS, Azure)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
        { name: 'Source Control (Git)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
      ],
      sortOrder: 3
    },
    {
      id: 4,
      category: 'Programming Languages',
      items: [
        { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
        { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
        { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
        { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
        { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' }
      ],
      sortOrder: 4
    }
  ]
};

export default resumeData;