import { Translation } from '../types/i18n';

export const skills: {
  [s in keyof Omit<Translation['skills'], 'title'>]: string[];
} = {
  frontend: [
    'React',
    'TypeScript',
    'JavaScript',
    'Angular',
    'Next.js',
    'React Native',
    'Material UI',
    'Styled Components',
  ],

  backend: [
    'Node.js',
    'Python',
    'Django',
    'Flask',
    'Pyramid',
    'Ruby on Rails',
    'Java',
    'Spring Boot',
  ],

  databases: ['PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB', 'Elasticsearch'],

  distributed: ['Kafka', 'RabbitMQ', 'GraphQL'],

  cloud: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Heroku', 'CI/CD'],

  testing: [
    'Cypress',
    'Datadog',
    'Grafana',
    'Jest',
    'Kibana',
    'Mocha',
    'Pytest',
    'Sentry',
    'Vitest',
  ],
};
