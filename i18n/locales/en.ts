import { defineMessages, Translation } from '../types';

const en: Translation = {
  home: {
    name: 'Cássio dos Santos Sousa',
    title: 'Senior Software Engineer',
    subtitle: 'Frontend Architecture • Large-Scale Web Platforms',
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
    practices: 'Engineering Practices',
  },

  resume: {
    summaryTitle: 'Professional Summary',

    summary:
      'Senior Software Engineer with 10+ years of experience building and operating large-scale web applications using React, TypeScript, and modern frontend architectures.',

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

  blog: {
    title: 'Blog',
    description:
      'Articles and insights on web development, software architecture, and best practices.',
  },
};

export default defineMessages(en);
