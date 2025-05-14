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
      title: 'Software Engineer',
      company: 'Monument Solar',
      location: 'Salt Lake City, Utah, USA - Remote',
      range: 'January 2024 – Present',
      url: '',
      description: `
        <ul>
          <li>Contributed to the development of a comprehensive full-stack Java application connecting travelers with landowners for RV parking, with responsibilities spanning both front-end and back-end development.</li>
          <li>Led the backend development using Java Spring Boot, focusing on scalable architecture, efficient API design, and integration with databases to ensure robust data handling.</li>
          <li>Implemented advanced front-end features using React and TypeScript, including dynamic listing views with pagination, interactive maps, and responsive UIs, enhancing user engagement and satisfaction.</li>
          <li>Designed and optimized RESTful APIs and executed complex queries with SQL database, supporting high-volume transactions and ensuring application performance.</li>
          <li>Maintained SQL schemas, optimizing data access through efficient query execution and indexing strategies.</li>
          <li>Leveraged AWS services for web hosting and S3 buckets for media storage, implemented JWT for session management and OAuth for authentication, and utilized Google Analytics to gather user insights. Documented the project using Confluence for streamlined collaboration.</li>
          <li>Coordinated extensive testing phases using Postman and implemented a CI/CD pipeline for efficient deployment, ensuring the application met all functional and security standards before launch.</li>
          <li>Actively participated in Agile development cycles and utilized Confluence for technical documentation, accelerating feature delivery by 25% and improving cross-team collaboration.</li>
        </ul>
      `,
    },
    {
      title: 'Developer Intern',
      company: 'University of Utah',
      location: 'Salt Lake City, Utah, USA',
      range: 'August 2023 – August 2024',
      url: 'https://www.utah.edu',
      description: `
        <ul>
          <li>Developed dynamic user interfaces for patient portals and administrative dashboards using ReactJS, Redux, and Tailwind CSS, enhancing usability for 80,000+ healthcare users and increasing user satisfaction by 20%.</li>
          <li>Translated wireframes and mockups into high-quality interactive web pages while adhering to modern UI/UX standards, improving accessibility compliance by 25%.</li>
          <li>Tested and debugged UI components for cross-browser compatibility and responsiveness, achieving 99.9% uptime and enabling uninterrupted healthcare workflows.</li>
          <li>Actively contributed to Agile development cycles, delivering iterative updates and enhancements aligned with project goals, ensuring timely feature releases.</li>
        </ul>
      `,
    },
    {
      title: 'Software Engineer',
      company: 'Total Infra & Mining Solutions',
      location: 'Hyderabad, India',
      range: 'November 2021 – July 2023',
      url: 'https://www.total24x7.com/shop/',
      description: `
        <ul>
          <li>Engineered scalable backend services for an internal procurement management system using Java, Spring Boot, and Hibernate, enhancing transaction throughput and improving backend processing performance by 20%.</li>
          <li>Designed and developed robust RESTful APIs for procurement workflows, vendor management, and approval systems, achieving a 30% reduction in response times through efficient service-layer optimizations.</li>
          <li>Modeled and optimized complex database schemas in Oracle Database, leveraging PL/SQL for stored procedures and triggers to handle business-critical logic and ensuring high-performance data operations.</li>
          <li>Secured APIs and backend systems using Spring Security with OAuth 2.0 and Role-Based Access Control (RBAC), ensuring compliance with enterprise-grade access control requirements.</li>
          <li>Containerized backend services using Docker to create consistent development, staging, and production environments, and implemented environment-specific configurations for Oracle integration.</li>
          <li>Streamlined CI/CD pipelines using Jenkins, integrated with Maven, Docker, and Kubernetes, reducing manual intervention and increasing deployment reliability by 50%.</li>
          <li>Deployed services on AWS EC2 and managed static assets with S3, supporting a reliable and scalable cloud infrastructure.</li>
          <li>Collaborated with cross-functional teams using Agile methodologies, participating in sprint planning, code reviews, and backend performance audits to drive continuous improvement and scalability.</li>
        </ul>
      `,
    },
    {
      title: 'Information Technology Intern',
      company: 'South Central Railway',
      location: 'India',
      range: 'June 2020 – January 2021',
      url: 'https://scr.indianrailways.gov.in/',
      description: `
        <ul>
          <li>Developed and maintained responsive front-end user interfaces for a mobile railway ticketing system using HTML, CSS, and modern JavaScript concepts, improving system responsiveness and user satisfaction by 35%.</li>
          <li>Provided frontline support and technical troubleshooting for UI navigation and performance optimizations, resolving issues efficiently and enhancing team collaboration.</li>
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
