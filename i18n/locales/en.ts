import { defineMessages, Translation, yearsSince } from '../types';

const en: Translation = {
  home: {
    name: 'Cássio dos Santos Sousa',
    title: 'Senior Software Engineer',
    subtitle: 'Frontend Architecture • Large-Scale Web Platforms',
    username: 'cassiossousa',
  },

  workExperience: {
    title: 'Work Experience',
    present: 'Present',
    previewResume: 'Preview Resume (PDF)',
  },

  skills: {
    title: 'Technical Skills',
    frontend: 'Frontend',
    backend: 'Backend',
    databases: 'Databases',
    distributed: 'Distributed Systems',
    cloud: 'Cloud & Infrastructure',
    testing: 'Testing & Observability',
  },

  resume: {
    summaryTitle: 'Professional Summary',

    summary: `Senior Software Engineer with ${yearsSince(2016)}+ years of experience building and operating large-scale, high-traffic web applications using React, TypeScript, and modern frontend architectures. Proven track record owning user-facing features end-to-end, from technical design and implementation to performance optimization and production support. Strong background in frontend system design, code health, testing strategies, and observability, with experience collaborating closely with Product, Design, Backend, and Data teams in distributed environments. Fluent in English and experienced mentoring engineers and leading frontend teams.`,

    experienceTitle: 'Work Experience',

    languagesTitle: 'Languages',

    languages: {
      portuguese: 'Portuguese - Native',
      english: 'English - Fluent',
    },
  },

  projects: {
    title: 'Projects',
    description:
      'Selected projects demonstrating system design, frontend architecture, and scalable product development.',
  },
};

export default defineMessages(en);
