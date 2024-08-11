import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;
const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: space-evenly; 
  flex-wrap: wrap; 
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    overflow-x: auto;
    padding-left: 10px;
    margin-left: 0;
    margin-bottom: 30px;
  }

  li {
    flex: 1 1 auto; 
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 10px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 10px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 150px; 
  height: var(--tab-height);
  padding: 0 10px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
  @media (max-width: 600px) {
    min-width: 120px;
    padding: 0 10px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Jobs = () => {
  const jobsData = [
    {
      title: 'Front-End Developer',
      company: 'CrashPad',
      location: 'Salt Lake City, UT',
      range: 'January 2024 - August 2024',
      url: '',
      description: `
        <ul>
          <li>Developed a responsive web design and mobile app for booking unique RV accommodations and managing RV properties, incorporating interactive maps, user authentication, and secure payments, resulting in a 50% increase in bookings.</li>
          <li>Designed and implemented a comprehensive registration and booking management system, ensuring seamless UI/UX and reducing user drop-off by 30%.</li>
          <li>Collaborated with the backend team using ReactJS, JavaScript, REST APIs, NodeJS, SQL, TypeScript, and Git, enhancing booking management efficiency by 40%.</li>
          <li>Utilized AWS for web hosting, S3 buckets for media storage, integrated Google Analytics for user insights, implemented JWT for session management, and OAuth for authentication, improving project delivery speed by 25%.</li>
        </ul>
      `,
    },
    {
      title: 'Graduate Teaching Assistant',
      company: 'University of Utah',
      location: 'Salt Lake City, UT',
      range: 'August 2023 - Present',
      url: 'https://www.utah.edu',
      description: `
        <ul>
          <li>Assisting in teaching web development courses, providing support to students in mastering modern web technologies.</li>
          <li>Developed and presented projects that enhanced students' skills, resulting in a 40% improvement in overall performance.</li>
        </ul>
      `,
    },
   
    {
      title: 'Software Engineer',
      company: 'Total Infra & Mining Solutions',
      location: 'Hyderabad, India',
      range: 'June 2018 - June 2020',
      url: 'https://www.total24x7.com/shop/',
      description: `
        <ul>
          <li>Developed and maintained responsive web applications using React and Node.js.</li>
          <li>Improved system performance by optimizing front-end components, leading to a 40% increase in sales.</li>
          <li>Collaborated with cross-functional teams to define and implement innovative solutions for improved user experience.</li>
        </ul>
      `,
    },
    {
      title: 'Information Technology Intern',
      company: 'South Central Railway',
      location: 'India',
      range: 'June 2020 - January 2021',
      url: 'https://scr.indianrailways.gov.in/',
      description: `
        <ul>
          <li>Contributed significantly to the creation and upkeep of responsive front-end design user interfaces for a mobile railway ticketing system, using HTML, CSS, and modern JavaScript concepts, resulting in a 35% improvement in system responsiveness and user satisfaction.</li>
          <li>Provided frontline support to colleagues, identifying problems and assisting with technical troubleshooting, bug fix analysis, and frontend-related issues. Conducted seminars on safe internet practices, leading to a 25% reduction in frontend-related incidents.</li>
        </ul>
      `,
    },
  ];

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  useEffect(() => focusTab(), [tabFocus]);

  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">I've worked with</h2>

      <div className="inner">
        <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
          {jobsData &&
            jobsData.map(({ company }, i) => (
              <StyledTabButton
                key={i}
                isActive={activeTabId === i}
                onClick={() => setActiveTabId(i)}
                ref={el => (tabs.current[i] = el)}
                id={`tab-${i}`}
                role="tab"
                tabIndex={activeTabId === i ? '0' : '-1'}
                aria-selected={activeTabId === i ? true : false}
                aria-controls={`panel-${i}`}>
                <span>{company}</span>
              </StyledTabButton>
            ))}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {jobsData &&
            jobsData.map(({ title, url, company, range, description }, i) => (
              <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                <StyledTabPanel
                  id={`panel-${i}`}
                  role="tabpanel"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-labelledby={`tab-${i}`}
                  aria-hidden={activeTabId !== i}
                  hidden={activeTabId !== i}>
                  <h3>
                    <span>{title}</span>
                    <span className="company">
                      &nbsp;@&nbsp;
                      <a href={url} className="inline-link">
                        {company}
                      </a>
                    </span>
                  </h3>

                  <p className="range">{range}</p>

                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </StyledTabPanel>
              </CSSTransition>
            ))}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
