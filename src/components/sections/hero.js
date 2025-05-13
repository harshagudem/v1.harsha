import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 1.2;
    text-align: center;
  }

  p {
    text-align: justify;
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const jobTitles = ['Masters in Information Systems', 'Software Engineer', 'Backend Developer', 'Backend Engineer', 'Full Stack Developer'];
  const [text] = useTypewriter({
    words: jobTitles,
    loop: true,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 1000,
  });

  const one = <h1>Hi! My Name is</h1>;
  const two = <h2 className="big-heading">Harshavardhan Gudem</h2>;
  const three = (
    <h3 className="medium-heading">
      {text}
      <Cursor cursorStyle="_" />
    </h3>
  );
  const four = (
    <>
      <p>
        <b>Glad to e-meet you!</b>
      </p>

      <p>
      I’m Harshavardhan Gudem, a software engineer with nearly 4 years of combined experience in building full-stack web applications, cloud-native systems, and responsive user interfaces.

       I hold a Master’s degree in Information Systems from the <a href="http://www.https://eccles.utah.edu/programs/master-of-science-in-information-systems/.ac.in">
        University of Utah</a> and a Bachelor’s degree from <a href="https://jntuh.ac.in/">JNTU</a>.
      </p>

      <p>
      My core strength lies in designing and developing scalable, user-centric applications using modern technologies like Java Spring Boot, SQL/NoSQL databases, React.js, TypeScript and AWS services. I’ve contributed to impactful projects in the Accommodation booking, healthcare, and infrastructure domains—delivering solutions that improved system performance, user engagement, and deployment efficiency.      </p>
      <p>Whether it’s crafting dynamic front-end experiences or architecting efficient back-end APIs, I take a holistic approach to software development—prioritizing clean code, performance, and maintainability. I’m passionate about continuous learning, cloud computing, and solving real-world problems through technology.</p>
    </>
  );

  const items = [one, two, three, four];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
