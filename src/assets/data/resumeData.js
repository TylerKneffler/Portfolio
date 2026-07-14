// Static resume data extracted from updated master resume
export const resumeData = {
  personalInfo: {
    fullName: 'Tyler Kneffler',
    title: 'Software Developer and Engineer',
    email: 'KnefflerTyler@gmail.com',
    phone: '(330) 447-1238',
    location: 'Dover, OH',
    linkedinUrl: null,
    githubUrl: 'https://tylerkneffler.github.io/Portfolio',
    summary: 'Software Developer and Engineer with over 3 years of professional experience and a strong foundation from 4 years of academic training in Computer Science and Engineering at The Ohio State University. Proven expertise in full-stack development, cross-platform mobile applications, cloud infrastructure, and the full software development lifecycle. Skilled in designing scalable, high-performance solutions, integrating APIs, and implementing robust software architectures.'
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
        'Documented troubleshooting procedures and trained new staff to ensure consistent IT support coverage',
        'Provided student support at Digital Union facilities for 3D modeling, printing, engraving, and programming'
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

  projects: [
    {
      id: 10,
      name: 'DeadNot',
      description: 'Solo-developed and published first-person psychological horror game, free on Steam.',
      technologies: ['Unity', 'C#'],
      highlights: [
        'Sole developer — all programming, design, art direction, and publishing handled end-to-end',
        'Published free on Steam with full store page, build pipeline, and release management',
        'Custom in-world console UI system simulating ship controls — interactive menus, command inputs, and system readouts',
        'Custom camera renderer pipeline producing pixel-art-style monitors and in-world displays with dynamic content',
        'Hostile entity AI with look-based detection — player exposure time tracked to trigger escalating threat behavior',
        'Atmospheric environmental storytelling through scannable points of interest and discoverable ship logs',
        'First-person psychological horror pacing built around tension and isolation.'
      ],
      githubUrl: null,
      liveUrl: 'https://store.steampowered.com/app/4505110/DeadNot/',
      liveUrlLabel: 'Steam Page',
      imageUrl: null,
      videoUrl: 'https://video.akamai.steamstatic.com/store_trailers/4505110/245853755/c408001f5df51a711d7991c7490af39d0c9cea71/1773196610/hls_264_master.m3u8?t=1773697439',
      videoThumbnailUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/257301344/e904649a3c8bdd907fbfefc4d0ad4a57169ddf75/movie_600x337.jpg?t=1773697439',
      year: 2026,
      sortOrder: 1
    },
    {
      id: 11,
      name: '2D Pixel Sandbox',
      description: 'Interactive pixel simulation engine with physics-based interactions, multiple material types, terrain generation, and a full-featured editor UI for scene building and manipulation.',
      technologies: ['JavaScript', 'HTML5 Canvas', 'WebGL', 'GLSL'],
      highlights: [
        'Engineered a pixel-by-pixel simulation engine with multi-layer architecture (foreground, background, backdrop) supporting 30+ unique material types including fire, water, vegetation, and dynamic objects.',
        'Implemented realistic physics simulation including gravity, buoyancy, thermal transfer, temperature-based state changes, and material interactions (combustion, plant growth, gas expansion, reactions).',
        'Built modular pixel type system with base class inheritance for extensible material behaviors and custom pixel properties (flammability, combustibility, density).',
        'Developed dynamic object system for world entities (campfire, trees, tents, fishing rod) with scripted behaviors and state persistence across save/load cycles.',
        'Created multi-layer opacity and visibility controls with per-layer darkening effects for compositing complex scenes.',
        ],
      githubUrl: 'https://github.com/TylerKneffler/WebEffectsLibrary/tree/main/pages/2d_pixel_sandbox',
      liveUrl: 'https://tylerkneffler.github.io/WebEffectsLibrary/pages/2d_pixel_sandbox/',
      liveUrlLabel: 'Open Sandbox',
      imageUrl: '/Portfolio/assets/uploads/2d_pixel_sandbox.gif',
      videoUrl: null,
      videoThumbnailUrl: null,
      year: 2026,
      sortOrder: 1.5
    },
    {
      id: 12,
      name: 'Connected Tanks',
      description: 'Standalone peer-to-peer multiplayer browser tank game with WebGL rendering, invite-link rooms, arena rotation, and card-based combat modifiers.',
      technologies: ['JavaScript', 'HTML5 Canvas', 'WebGL', 'GLSL', 'WebRTC', 'PeerJS'],
      highlights: [
        'Built a real-time multiplayer tank arena where hosts create rooms and players join through shareable invite links.',
        'Implemented PeerJS/WebRTC networking with host-authoritative snapshots for player state, level data, movement, and combat actions.',
        'Created a custom WebGL sprite renderer with GLSL shaders for canvas-based tank and projectile rendering.',
        'Designed round and match systems with selectable level pools, configurable wins required, loading states, HUD controls, and host-only match controls.',
        ],
      githubUrl: 'https://github.com/TylerKneffler/WebEffectsLibrary/tree/main/pages/conn_tanks',
      liveUrl: 'https://tylerkneffler.github.io/WebEffectsLibrary/pages/conn_tanks/views/game.html',
      liveUrlLabel: 'Play Game',
      imageUrl: '/Portfolio/assets/uploads/conn_tanks.gif',
      videoUrl: null,
      videoThumbnailUrl: null,
      year: 2026,
      sortOrder: 1.75
    },
    {
      id: 13,
      name: 'Web Effect Library',
      description: 'Learning and testing ground for browser based web apps',
      technologies: ['html', 'javascript', 'webgl', 'threejs'],
      highlights: [
        'Built a collection of interactive browser experiments focused on real-time visuals, interactive mechanics, and WebGL rendering.',
        'Implemented peer-to-peer connection experiments for browser-based multiplayer prototypes using the conn pages.',
        'Developed reusable JavaScript patterns for animation loops, input handling, canvas effects, and Three.js scenes.',
        'Used the project as a sandbox for prototyping browser-based apps and polishing small interactive experiences.',
      ],
      githubUrl: 'https://github.com/TylerKneffler/WebEffectsLibrary',
      liveUrl: null,
      liveUrlLabel: null,
      imageUrl: '/Portfolio/assets/uploads/WebEffectsLibraryScreenshot.png',
      videoUrl: null,
      videoThumbnailUrl: null,
      year: 2026,
      sortOrder: 2
    },
    {
      id: 1,
      name: 'Warehouse Packaging and Employee Management App',
      description: 'Cross-platform mobile and admin application to manage productivity, materials, and packaging operations with real-time sync and barcode scanning.',
      technologies: ['Xamarin', '.NET MAUI'],
      highlights: [
        'Real-time database synchronization for workstation activity and productivity logging',
        'Barcode scanning integration for product/material tracking',
        'Custom package assembly instructions and rendering system',
        'Automated label generation and printing tied to batch and order IDs',
        'Inventory management with live updates and reorder alerts',
        'Role-based dashboards for supervisors and workers with real-time analytics'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/warrehouse_phone_example.png',
      year: null,
      sortOrder: 4
    },
    {
      id: 2,
      name: 'TimeCard App & Administrative Site',
      description: 'Cross-platform employee time tracking system with facial recognition authentication, geofencing, and a .NET administrative portal for reporting and management.',
      technologies: ['ASP.NET', '.NET MAUI'],
      highlights: [
        'Facial recognition authentication to prevent buddy punching',
        'Real-time geolocation and geofencing for job site verification',
        'API-driven architecture connecting mobile app and web portal',
        'Comprehensive reporting tools and exportable summaries for workforce analytics'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/TimeCardApp.png',
      year: null,
      sortOrder: 5
    },
    {
      id: 3,
      name: 'Shipping Plugin',
      description: 'Custom WordPress shipping plugin providing dynamic rulesets and carrier API integration for real-time rates and tracking.',
      technologies: ['PHP', 'JavaScript', 'HTML'],
      highlights: [
        'Dynamic rulesets for shipping rate calculation based on product, cart, weight, and destination',
        'Integration with UPS/FedEx/USPS APIs for live rates and tracking',
        'Administrative interface for zones, custom rate tables, and handling fees',
        'AJAX-based front-end updates for instant rate recalculation during checkout'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/shipping_plugin.png',
      year: null,
      sortOrder: 6
    },
    {
      id: 4,
      name: 'Gift Card Plugin',
      description: 'Secure WordPress gift card system with bulk generation, PDF output, role-based access, and transaction logging.',
      technologies: ['PHP', 'JavaScript', 'HTML'],
      highlights: [
        'Bulk card creation and import tools with unique identifiers and balance tracking',
        'PDF generation for printable cards',
        'Administrative backend for manual redemptions and analytics',
        'Role-based access controls to protect financial operations'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/giftcardplugin.png',
      year: null,
      sortOrder: 7
    },
    {
      id: 5,
      name: 'Embedded Systems & Robotics Projects',
      description: 'Series of embedded systems and robotics projects at OSU including an autonomous energy vehicle (AEV), marble sorting robot, and automatic lighting system, focusing on sensor integration, embedded control, and performance optimization.',
      technologies: ['MatLab', 'C++', 'Arduino'],
      highlights: [
        'Autonomous energy vehicle with embedded control systems and sensor-based navigation',
        'Concept selection and trade-off analysis (aerodynamics vs weight)',
        'Sensor-driven sorting robot with color and proximity detection',
        'Automatic lighting system using ambient light and motion sensors',
        'Interrupt-driven programming and feedback control loops for precise behavior',
        'Performance data collection and iterative optimization',
        'Hardware/software integration and firmware development'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/AEVData.png',
      year: null,
      sortOrder: 8
    },
    {
      id: 6,
      name: 'Radar-Inspired Aircraft Flight Path Simulation',
      description: 'Real-time simulation of aircraft flight paths with radar-style tracking, flight plan management, and vector-based trajectory rendering.',
      technologies: ['C'],
      highlights: [
        'Simulated live tracking and visualization of multiple aircraft',
        'Flight plan input and dynamic course correction handling',
        'Efficient data structures and rendering optimizations for real-time performance'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/radar_simulation.gif',
      year: null,
      sortOrder: 1.9
    },
    {
      id: 7,
      name: 'Above the Clouds',
      description: 'Action-adventure Unity game with procedural levels, combat mechanics, and player progression systems.',
      technologies: ['Unity', 'C#'],
      highlights: [
        'Procedural level generation for replayability',
        'Custom combat system and animation blending',
        'Inventory, shop systems, and player progression mechanics'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/above_the_clouds.png',
      year: null,
      sortOrder: 10
    },
    {
      id: 8,
      name: 'Game Development Research Project',
      description: 'Research-driven projects recreating classic SNES titles to study mechanics and design; implemented platformer gameplay, character controllers, and game state management.',
      technologies: ['MonoGame', 'C#'],
      highlights: [
        'Recreated platformer mechanics from classic titles for research',
        'Implemented collision, movement, and level interaction systems',
        'Agile iteration and playtesting to refine game systems'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/kirby-gameplay.gif',
      year: null,
      sortOrder: 2
    },
    {
      id: 9,
      name: 'Unity Card Game System with RTS-Style Battlefield',
      description: 'Comprehensive card game framework built in Unity featuring deck management, hand controllers, discard piles, and an RTS-inspired battlefield system for tactical card-based gameplay.',
      technologies: ['Unity', 'C#'],
      highlights: [
        'Architected modular card controller system with base classes for extensible gameplay zones',
        'Implemented curved hand layout using Bezier curves with dynamic spacing and interactive hover effects',
        'Built player and enemy deck systems with drawing and discard pile management',
        'Designed battlefield controller for RTS-style card placement and spatial positioning',
        'Created mouse-based card selection with distance calculations and visual feedback',
        'Developed smooth animation system for card positioning, rotation, and transitions',
        'Implemented elevation-based rendering for card depth and selection highlighting'
      ],
      githubUrl: null,
      liveUrl: null,
      imageUrl: '/Portfolio/assets/uploads/card_game.gif',
      year: null,
      sortOrder: 3
    }
  ],

  skills: [
    {
      id: 1,
      category: 'Programming Languages',
      items: [
        { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
        { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
        { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'Swift', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
        { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
        { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
        { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' }
      ],
      sortOrder: 1
    },
    {
      id: 2,
      category: 'Frameworks & Platforms',
      items: [
        { name: 'ASP.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
        { name: '.NET MAUI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
        { name: 'Xamarin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
        { name: 'Unity', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg' },
        { name: 'Unreal Engine', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg' },
        { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg' },
        { name: 'Blazor', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
        { name: 'ReactJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' }
      ],
      sortOrder: 2
    },
    {
      id: 3,
      category: 'Web & Mobile Development',
      items: [
        { name: 'Full-Stack Development', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Mobile App Development (Native & Cross-Platform)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
        { name: 'API Integration (RESTful Services)', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' }
      ],
      sortOrder: 3
    },
    {
      id: 4,
      category: 'Database & Cloud',
      items: [
        { name: 'SQL Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Database Design & Management', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'AWS', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/AWS_Simple_Icons_AWS_Cloud.svg' },
        { name: 'Cloud Deployment', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/AWS_Simple_Icons_AWS_Cloud.svg' }
      ],
      sortOrder: 4
    },
    {
      id: 5,
      category: 'DevOps & Tools',
      items: [
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Git / GitHub Actions', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'CI/CD', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' }
      ],
      sortOrder: 5
    },
    {
      id: 6,
      category: 'Software Practices',
      items: [
        { name: 'OOP & Design Patterns', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'System Design & Scalability', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/architect/architect-original.svg' },
        { name: 'Testing & QA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg' },
        { name: 'Performance Optimization', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' }
      ],
      sortOrder: 6
    }
  ],

  education: [
    {
      id: 1,
      institution: 'The Ohio State University',
      degree: 'BS, Computer Science and Engineering',
      fieldOfStudy: null,
      location: 'Columbus, OH',
      graduationYear: '2022',
      additionalInfo: [
        'H2O Student Team',
        'OSU Work Study: Student Math/Calculus Tutoring Assistant',
        'OSU Work Study: Student Tech Assistant'
      ],
      sortOrder: 1
    },
    {
      id: 2,
      institution: 'New Philadelphia High School',
      degree: 'High School Diploma',
      fieldOfStudy: null,
      location: 'New Philadelphia, OH',
      graduationYear: '2018',
      additionalInfo: [
        'Marching Band – Drumline (Center Snare)',
        'Concert Band – Percussionist',
        'Steel Drum Band – Double Tenor Pan & Drum Set',
        'Indoor Percussion Ensemble – Lead Marimba',
        'Project Lead the Way – 3D printing, Arduino, robotics'
      ],
      sortOrder: 2
    }
  ]
};

export default resumeData;
