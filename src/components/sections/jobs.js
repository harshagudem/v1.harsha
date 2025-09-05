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
      company: 'Pagoda Tree Education Ltd',
      location: 'Salt Lake City, Utah, USA - Remote',
      range: 'June 2025 – Present',
      url: '',
      description: `
        <ul>
  <li>Migrated a monolithic WordPress education site into a React + Spring Boot microservices architecture, eliminating bottlenecks and improving feature delivery cycles by 40%, enabling faster innovation and maintainability.</li>
  <li>Engineered and deployed RESTful APIs with Spring Boot and PostgreSQL, introducing indexing and caching that reduced API response latency by 35% and improved data consistency across modules.</li>
  <li>Built and deployed a student-facing AI chatbot using LLM-based APIs, enabling real-time Q&amp;A, course tracking, and personalized study support. Improved student engagement and retention by providing always-available assistance.</li>
  <li>Rebuilt key user-facing modules (registration, course enrollment, payment flows) using React, Redux, Tailwind CSS, resulting in a 25% uplift in satisfaction scores measured by session duration and reduced bounce rates.</li>
  <li>Containerized services with Docker and deployed on AWS EKS (Kubernetes), achieving 99.9% uptime and enabling zero-downtime releases through rolling updates and blue/green strategies.</li>
  <li>Designed secure PostgreSQL schemas and automated migration from MySQL, improving database performance by 30%.</li>
  <li>Built CI/CD pipelines with GitHub Actions, automating builds, tests, and deployments to cut deployment time from hours to minutes, boosting developer velocity.</li>
  <li>Implemented OAuth2 and JWT authentication for robust identity and access management, strengthening compliance with industry security standards.</li>
  <li>Collaborated in Agile ceremonies, improving sprint predictability and accelerating feature delivery by 20%.</li>
</ul>
      `,
    },
    {
      title: 'Software Engineer',
      company: 'Monument Solar',
      location: 'Salt Lake City, Utah, USA - Remote',
      range: 'January 2024 – June 2025',
      url: '',
      description: `
        <ul>
  <li><strong>Crashpad:</strong> Consumer web platform connecting RV travelers with private landowners.</li>
  <li>Designed and scaled Crashpad, a full-stack booking platform built with Spring Boot, Oracle DB, and React, onboarding 15,000+ active users within six months and proving scalability of a new consumer-facing product.</li>
  <li>Engineered high-performance REST APIs for bookings and transactions, applying indexing, query tuning, and pagination to cut backend latency by 30% and ensure smooth user experience.</li>
  <li>Built map-based search, interactive listings, and dynamic filters using React, Redux Toolkit, and Leaflet.js, improving navigation and boosting booking conversions by 22%.</li>
  <li>Implemented secure authentication and role-based access control with OAuth2 + JWT, reducing unauthorized access incidents by 90% and ensuring user trust.</li>
  <li>Automated deployments with AWS (EC2, S3), Kubernetes, and Helm, achieving 99.9% uptime and ensuring zero rollback failures across environments.</li>
  <li>Built CI/CD pipelines (Jenkins + GitHub Actions) with automated testing and observability checks, reducing release cycles by 60% and increasing deployment reliability.</li>
  <li>Delivered a property and booking management system with audit logging, lowering admin errors by 40% and improving operational transparency.</li>
  <li>Documented APIs and workflows in Confluence and Postman, improving onboarding speed and collaboration by 25%.</li>
</ul>

      `,
    },
    {
      title: 'Teaching Assistant (TA)',
      company: 'University of Utah',
      location: 'Salt Lake City, Utah, USA',
      range: 'August 2023 – August 2024',
      url: 'https://www.utah.edu',
      description: `
        <ul>
          <li>Assisted in delivery of courses on Java, REST APIs, SQL, and SDLC practices to 100+ students across 3 semesters, reinforcing industry-ready development skills</li>
          <li>Facilitated weekly coding labs and debugging workshops, increasing assignment completion rates by 25%</li>
          <li>Provided over 300 one-on-one support sessions, clarifying API design, database normalization, and debugging strategies</li>
          <li>Graded and reviewed capstone projects, providing feedback that improved student code quality and testability by 20%.</li>
          <li>Mentored students on Git workflows and Agile, 80% reported higher confidence in production-grade development.</li>

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
  <li>Developed backend services for a procurement management platform using Java, Spring Boot, and Hibernate, improving throughput by 20% and reducing processing delays.</li>
  <li>Built secure REST APIs for procurement workflows and vendor systems, with service-layer optimizations that cut response times by 30%, enhancing user efficiency.</li>
  <li>Modeled and optimized schemas in Oracle DB with PL/SQL procedures and triggers, ensuring reliable high-volume data transactions.</li>
  <li>Implemented enterprise-grade security with Spring Security (OAuth2, RBAC), preventing unauthorized access and ensuring compliance with IT controls.</li>
  <li>Containerized services with Docker and deployed to AWS EC2/S3, reducing environment drift and deployment failures.</li>
  <li>Automated CI/CD pipelines in Jenkins (integrated with Maven, Docker, Kubernetes), reducing manual intervention and increasing release reliability by 50%.</li>
  <li>Collaborated in Agile sprints, code reviews, and backend performance audits, driving continuous improvement in scalability and reliability.</li>
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
