import React, { useState, useEffect, useRef } from 'react';
import { useResumeData } from '../../hooks/useResumeData';
import GalaxyBackground from '../../components/Galaxy/GalaxyBackground';
import ParallaxGalaxyBackground from '../../components/Galaxy/ParallaxGalaxyBackground';
import { useGalaxyContext } from '../../contexts/GalaxyContext';
import '../../styles/pages/public/home_page.css';

function Home() {
  // Get selected galaxies and active section from context
  const { selectedGalaxies, activeSection, setActiveSection } = useGalaxyContext();

  // Fetch resume data
  const { resumeData, loading, error } = useResumeData();

  // State for scroll animations
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  // Reset visible sections when data changes
  useEffect(() => {
    if (loading || error) {
      setVisibleSections(new Set());
    }
  }, [loading, error]);
  
  // Use ref for immediate scroll direction access
  const scrollDirectionRef = useRef('down');
  const lastScrollYRef = useRef(0);

  // Debug mode - set to true to visualize spacers
  const DEBUG_SPACERS = false;

  // Spacer configuration - easily adjust scroll distances
  const spacerConfig = {
    heroToAbout: '10vh',    // Reduced for tighter spacing
    aboutToSkills: '10vh',  // Reduced for tighter spacing  
    skillsToProjects: '10vh', // Reduced for tighter spacing
    projectsToEducation: '12vh', // Reduced for tighter spacing
    educationToContact: '15vh' // Reduced for tighter spacing
  };

  // Extract data from resume - no fallbacks, show loading/error instead
  const { personalInfo, skills, projects, workExperience, education } = resumeData;

  useEffect(() => {
    // Don't set up observers until we have data
    if (loading || error || !personalInfo) {
      return;
    }

    // Ensure no horizontal scroll
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    let ticking = false;
    
    // More robust scroll direction detection - optimized for mobile
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      
      // Increased threshold for mobile to reduce jitter (was 1)
      if (Math.abs(delta) > 5) {
        const newDirection = delta > 0 ? 'down' : 'up';
        
        // Update refs immediately
        scrollDirectionRef.current = newDirection;
        lastScrollYRef.current = currentScrollY;
        
        // Update state for re-renders
        setScrollDirection(newDirection);
        setLastScrollY(currentScrollY);
      }
      
      ticking = false;
    };
    
    // Throttled scroll handler using requestAnimationFrame
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Also detect with wheel events for better responsiveness - optimized for mobile
    const handleWheel = (e) => {
      // Only update on significant wheel movement to reduce jitter
      if (Math.abs(e.deltaY) > 10) {
        const newDirection = e.deltaY > 0 ? 'down' : 'up';
        
        scrollDirectionRef.current = newDirection;
        setScrollDirection(newDirection);
      }
    };

    // Touch event handling for mobile devices
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (!touchStartY) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      // Only update on significant touch movement
      if (Math.abs(deltaY) > 20) {
        const newDirection = deltaY > 0 ? 'down' : 'up';
        
        scrollDirectionRef.current = newDirection;
        setScrollDirection(newDirection);
        touchStartY = touchY; // Reset for continuous detection
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Intersection Observer for section visibility - improved for mobile
    const observerOptions = {
      threshold: 0,
      rootMargin: '-10% 0px -10% 0px' // Appear when section is just entering the viewport
    };

    const observer = new IntersectionObserver((entries) => {
      let maxRatio = 0;
      let active = null;
      
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, sectionId]));
          
          // Track the most visible section
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            active = sectionId;
          }
        } else {
          setVisibleSections(prev => {
            const newSet = new Set(prev);
            newSet.delete(sectionId);
            return newSet;
          });
        }
      });
      
      // Update active section if we found one
      if (active) {
        setActiveSection(active);
      }
    }, observerOptions);

    // Wait for DOM to be ready, then observe sections
    setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach(section => {
        observer.observe(section);
      });

      // Initial visibility check
      const initialCheck = new IntersectionObserver((entries) => {
        const initiallyVisible = new Set();
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            initiallyVisible.add(entry.target.id);
          }
        });
        if (initiallyVisible.size > 0) {
          setVisibleSections(initiallyVisible);
        }
      }, observerOptions);

      sections.forEach(section => initialCheck.observe(section));
      
      // Cleanup initial check after brief moment
      setTimeout(() => {
        initialCheck.disconnect();
      }, 100);
    }, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      // Cleanup overflow styles
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
    };
  }, [loading, error, personalInfo, lastScrollY, scrollDirection, setActiveSection]);

  // Individual item visibility tracking
  const [visibleSkillRows, setVisibleSkillRows] = useState(new Set());
  const [visibleExperience, setVisibleExperience] = useState(new Set());
  const [visibleProjects, setVisibleProjects] = useState(new Set());
  const [visibleEducation, setVisibleEducation] = useState(new Set());
  
  useEffect(() => {
    const itemObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // Reduced threshold so items animate sooner
    };

    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const itemId = entry.target.dataset.itemId;
        const itemType = entry.target.dataset.itemType;
        
        if (entry.isIntersecting && itemId) {
          if (itemType === 'skill-row') {
            setVisibleSkillRows(prev => new Set([...prev, itemId]));
          } else if (itemType === 'experience') {
            setVisibleExperience(prev => new Set([...prev, itemId]));
          } else if (itemType === 'project') {
            setVisibleProjects(prev => new Set([...prev, itemId]));
          } else if (itemType === 'education') {
            setVisibleEducation(prev => new Set([...prev, itemId]));
          }
        }
      });
    }, itemObserverOptions);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const skillRows = document.querySelectorAll('.skills__row');
      const experienceItems = document.querySelectorAll('.experience-card');
      const projectItems = document.querySelectorAll('.project-card');
      const educationItems = document.querySelectorAll('.education-card');
      
      [...skillRows, ...experienceItems, ...projectItems, ...educationItems].forEach(item => {
        if (item.dataset.itemId) {
          itemObserver.observe(item);
        }
      });
    }, 500);

    return () => itemObserver.disconnect();
  }, [skills, workExperience, projects, education]);

  // Animation function - fade up/down based on scroll direction
  const getSectionStyle = (sectionId) => {
    const isVisible = visibleSections.has(sectionId);

    if (!isVisible) {
      // Use ref for immediate direction access (not delayed state)
      const currentDirection = scrollDirectionRef.current;
      // When scrolling DOWN: sections should fade UP (from below)
      // When scrolling UP: sections should fade DOWN (from above)
      const translateY = currentDirection === 'down' ? 30 : -30;
      return {
        opacity: 0,
        filter: 'blur(16px) brightness(0.7)',
        transform: `translateY(${translateY}px) scale(0.98)`,
        pointerEvents: 'none',
        visibility: 'hidden',
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1), visibility 0s 0.6s',
      };
    }

    // Visible state - always centered
    return {
      opacity: 1,
      filter: 'blur(0px) brightness(1)',
      transform: 'translateY(0px) scale(1)',
      pointerEvents: 'auto',
      visibility: 'visible',
      transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1), visibility 0s',
    };
  };

  // Spacer component for controlling scroll distance
  const Spacer = ({ height = '400px', id = '', debug = false }) => (
    <div 
      id={id}
      className={`spacer ${debug ? 'spacer--debug' : ''}`}
      style={{ height: height }}
    >
      {debug && `Spacer: ${height}`}
    </div>
  );

  // Handle loading and error states
  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error || !personalInfo) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <h2>Unable to Load Content</h2>
          <p>Error loading resume data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Galaxy Background - Two Galaxies (fixed position) */}
      <ParallaxGalaxyBackground strength={0} smoothness={0.12} pixelCap={20000}>
        {/* Galaxy backgrounds below overlay */}
        <GalaxyBackground
          key={selectedGalaxies.starfield}
          galaxyType={selectedGalaxies.starfield}
          animate={true}
          opacity={0.5}
          cameraDistance={2000}
          rotationSpeed={0.00001}
          includeStarfield={true}
          zIndex={0}
          pixelRatio={.6}
        />
        {/* Actual galaxy structure */}
        <GalaxyBackground
          key={selectedGalaxies.main}
          galaxyType={selectedGalaxies.main}
          animate={true}
          opacity={0.9}
          cameraDistance={5000}
          rotationSpeed={0.00003}
          includeStarfield={false}
          zIndex={0}
          pixelRatio={.6}
        />
        {/* Black overlay for dimming effect */}
        <div className="black-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'black',
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }} />
      </ParallaxGalaxyBackground>

      {/* Hero Section */}
      <section 
        id="hero"
        className="hero-section"
        style={{...getSectionStyle('hero'), zIndex: 1}}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            {personalInfo.fullName}
          </h1>
          <h2 className="hero-subtitle">
            {personalInfo.title}
          </h2>
          <p className="hero-description">
            {personalInfo.summary}
          </p>
        </div>
      </section>

      <Spacer height={spacerConfig.heroToAbout} id="spacer-hero-about" debug={DEBUG_SPACERS} />

      <Spacer height={spacerConfig.heroToAbout} id="spacer-hero-experience" debug={DEBUG_SPACERS} />

      {/* Work Experience Section */}
      {workExperience && workExperience.length > 0 && (
        <section 
          id="experience"
          className="experience-section"
          style={{...getSectionStyle('experience'), zIndex: 1}}
        >
          <div className="section-content">
            <h2 className="section-header">
              Professional Experience
            </h2>
            <div className="experience-timeline">
              {workExperience.map((job, index) => {
                const experienceId = `experience-${index}-${job.id || job.position.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                const isVisible = visibleExperience.has(experienceId);
                
                return (
                  <div 
                    key={job.id || index} 
                    className={`experience-card ${isVisible ? 'experience-card-fade-in' : ''}`}
                    data-item-id={experienceId}
                    data-item-type="experience"
                    data-item-delay={index * 200} // Staggered delay: 0ms, 200ms, 400ms, etc.
                  >
                    <div className="experience-header">
                      <div className="job-info">
                        <h3 className="job-title">{job.position}</h3>
                        <h4 className="company-name">{job.company}</h4>
                        <div className="job-meta">
                          <span className="job-location">{job.location}</span>
                          <span className="job-dates">
                            {job.startDate} - {job.isCurrent ? 'Present' : job.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ul className="responsibilities">
                      {job.responsibilities.map((responsibility, respIndex) => (
                        <li key={respIndex}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Spacer height={spacerConfig.aboutToSkills} id="spacer-experience-skills" debug={DEBUG_SPACERS} />

      {/* Skills Section */}
      <section 
        id="skills"
        className="skills-section"
        style={{...getSectionStyle('skills'), zIndex: 1}}
      >
        <div className="section-content wide-content">
          <h2 className="section-header">
            Technical Skills
          </h2>
          <div className="skills">
            {skills && skills.length > 0 ? (
              // Group all skills into rows of 3-4 items each
              (() => {
                const allSkills = skills.flatMap(skillGroup => 
                  skillGroup.items.map(item => ({
                    name: typeof item === 'string' ? item : item.name,
                    icon: typeof item === 'object' ? item.icon : null,
                    category: skillGroup.category
                  }))
                );
                
                const rows = [];
                const itemsPerRow = window.innerWidth <= 768 ? 2 : (window.innerWidth <= 1024 ? 3 : 4);
                
                for (let i = 0; i < allSkills.length; i += itemsPerRow) {
                  rows.push(allSkills.slice(i, i + itemsPerRow));
                }
                
                return rows.map((row, rowIndex) => {
                  const rowId = `skill-row-${rowIndex}`;
                  const isRowVisible = visibleSkillRows.has(rowId);
                  
                  return (
                    <div 
                      key={rowIndex} 
                      className={`skills__row ${isRowVisible ? 'skills__row-fade-in' : ''}`}
                      data-item-id={rowId}
                      data-item-type="skill-row"
                    >
                      {row.map((skill, skillIndex) => (
                        <div 
                          key={`${rowIndex}-${skillIndex}`}
                          className={`skills__item skills__item--${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                        >
                        {skill.icon && (
                          <img 
                            src={skill.icon} 
                            alt={`${skill.name} icon`}
                            className="skills__item-icon"
                            onError={(e) => {
                              // Hide image if it fails to load
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="skills__item-name">
                          {skill.name.toUpperCase()}
                        </div>
                      </div>
                      ))}
                    </div>
                  );
                });
              })()
            ) : (
              <p>No skills data available</p>
            )}
          </div>
        </div>
      </section>

      <Spacer height={spacerConfig.skillsToProjects} id="spacer-skills-projects" debug={DEBUG_SPACERS} />

      {/* Projects Section*/}
      <section 
        id="projects"
        className="projects-section full-width"
        style={{...getSectionStyle('projects'), zIndex: 1}}
      >
        <div className="projects-container">
          <div className="section-content">
            <h2 className="section-header projects-header">
              My Work
            </h2>
          </div>
          <div className="projects-grid full-width-grid">
            {projects && projects.length > 0 ? projects.map((project, index) => {
              const projectId = `project-${index}-${project.id || project.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
              const isVisible = visibleProjects.has(projectId);
              
              return (
                <div 
                  key={project.id || index} 
                  className={`project-card full-width-card ${isVisible ? 'project-card-fade-in' : ''} ${!project.imageUrl ? 'project-card-no-image' : ''}`}
                  data-item-id={projectId}
                  data-item-type="project"
                >
                {project.imageUrl && (
                  <div className="project-image">
                    <img 
                      src={project.imageUrl} 
                      alt={`${project.name} preview`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">
                      {project.name}
                    </h3>
                    {project.year && (
                      <span className="project-year">{project.year}</span>
                    )}
                  </div>
                  <p className="project-description">
                    {project.description}
                  </p>
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="project-highlights">
                      {project.highlights.map((highlight, hIndex) => (
                        <li key={hIndex}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  <div className="project-tech">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.images && project.images.length > 0 && (
                    <div className="project-gallery">
                      {project.images.map((image, imgIndex) => (
                        <img 
                          key={imgIndex}
                          src={image} 
                          alt={`${project.name} screenshot ${imgIndex + 1}`}
                          className="gallery-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {(project.githubUrl || project.liveUrl) && (
                    <div className="project-links">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                          <span>View Code</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link primary">
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              );
            }) : (
              <div className="no-projects">
                <p>No projects data available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Spacer height={spacerConfig.projectsToEducation} id="spacer-projects-education" debug={DEBUG_SPACERS} />

      {/* Education Section */}
      {education && education.length > 0 && (
        <section 
          id="education"
          className="education-section"
          style={{...getSectionStyle('education'), zIndex: 1}}
        >
          <div className="section-content">
            <h2 className="section-header">
              Education
            </h2>
            <div className="education-timeline">
              {education.map((edu, index) => {
                const itemId = `education-${edu.id || index}`;
                const isVisible = visibleEducation.has(itemId);
                return (
                  <div 
                    key={edu.id || index} 
                    className={`education-card ${isVisible ? 'education-card-fade-in' : ''}`}
                    data-item-id={itemId}
                    data-item-type="education"
                  >
                    <div className="education-header">
                    <div className="edu-info">
                      <h3 className="degree">{edu.degree}</h3>
                      {edu.fieldOfStudy && <h4 className="field-of-study">{edu.fieldOfStudy}</h4>}
                      <h4 className="institution">{edu.institution}</h4>
                      <div className="edu-meta">
                        <span className="edu-location">{edu.location}</span>
                        <span className="graduation-year">{edu.graduationYear}</span>
                      </div>
                    </div>
                  </div>
                    {edu.additionalInfo && (
                      <p className="education-additional">{edu.additionalInfo}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Spacer height={spacerConfig.educationToContact} id="spacer-education-contact" debug={DEBUG_SPACERS} />

      {/* Contact Section */}
      <section 
        id="contact"
        className="contact-section"
        style={{...getSectionStyle('contact'), zIndex: 1}}
      >
        <div className="section-content contact-content">
          <h2 className="section-header">
            Let's Connect
          </h2>
          <p className="contact-description">
          </p>
          <div className="contact-links">
            <a 
              href={`mailto:${personalInfo.email}`}
              className="contact-link"
            >
              ✉️ {personalInfo.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
