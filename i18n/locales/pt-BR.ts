import { defineMessages, Translation, yearsSince } from '../../types/i18n';

const pt: Translation = {
  home: {
    name: 'Cássio dos Santos Sousa',
    title: 'Engenheiro de Software Sênior',
    subtitle: 'Arquitetura Frontend • Plataformas Web de Grande Escala',
    username: 'cassiossousa',
  },

  workExperience: {
    title: 'Experiência Profissional',
    present: 'Presente',
  },

  skills: {
    title: 'Competências Técnicas',
    frontend: 'Frontend',
    backend: 'Backend',
    databases: 'Bancos de Dados',
    distributed: 'Sistemas Distribuídos',
    cloud: 'Cloud & Infraestrutura',
    testing: 'Testes & Observabilidade',
  },

  resume: {
    title: 'Currículo',
    summaryTitle: 'Resumo Profissional',
    summary: `Engenheiro de Software Sênior formado no Instituto Tecnológico de Aeronáutica (ITA) com mais de ${yearsSince(2016)} anos de experiência no desenvolvimento de plataformas SaaS, sistemas distribuídos e aplicações de grande escala. Experiência no desenvolvimento de APIs, microsserviços e arquiteturas resilientes em ambientes cloud. Atuação em todo o ciclo de desenvolvimento: definição de arquitetura, implementação, observabilidade, manutenção em produção e evolução contínua de sistemas críticos. Experiência com Java, Node.js e Python no desenvolvimento de serviços backend e integração entre sistemas. Forte atuação em qualidade de código, boas práticas de engenharia, escalabilidade e confiabilidade de sistemas.`,
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
};

export default defineMessages(pt);
