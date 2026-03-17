import { defineMessages, Translation } from '../types';

const pt: Translation = {
  home: {
    name: 'Cássio dos Santos Sousa',
    title: 'Engenheiro de Software Sênior',
    subtitle: 'Arquitetura Frontend • Plataformas Web de Grande Escala',
  },

  workExperience: {
    title: 'Experiência Profissional',
    present: 'Atual',
    previewResume: 'Visualizar Currículo (PDF)',
  },

  skills: {
    title: 'Competências Técnicas',
    frontend: 'Frontend',
    backend: 'Backend',
    databases: 'Bancos de Dados',
    distributed: 'Sistemas Distribuídos',
    cloud: 'Cloud & Infraestrutura',
    testing: 'Testes & Observabilidade',
    practices: 'Práticas de Engenharia',
  },

  resume: {
    summaryTitle: 'Resumo Profissional',

    summary:
      'Engenheiro de Software Sênior com mais de 10 anos de experiência desenvolvendo aplicações web de grande escala utilizando React, TypeScript e arquiteturas modernas de frontend.',

    experienceTitle: 'Experiência Profissional',

    languagesTitle: 'Idiomas',

    languages: {
      portuguese: 'Português - Nativo',
      english: 'Inglês - Fluente',
    },
  },

  projects: {
    title: 'Projetos',
    description:
      'Projetos selecionados demonstrando arquitetura de frontend, design de sistemas e desenvolvimento de produtos escaláveis.',
  },

  blog: {
    title: 'Blog',
    description:
      'Artigos e insights sobre desenvolvimento web, arquitetura de software e boas práticas.',
  },
};

export default defineMessages(pt);
