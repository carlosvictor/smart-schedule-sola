import { Template, RotinaTemplate, SubblocoConfig } from '@/types/template';

export const PRECEPTORES_MOCK = [
  'Dr. Roberto Silva',
  'Dra. Patrícia Mendes',
  'Dr. Sandra Oliveira',
  'Dr. Carlos Santos',
  'Dra. Maria Costa',
  'Dr. João Pereira',
];

export const LOCAIS_MOCK = [
  'HELP',
  'Santa Casa de Misericórdia do Recife',
  'UPA Imbiribeira',
  'Hospital Central',
  'Clínica Norte',
  'UBS Sul',
  'Enfermaria 1',
  'Enfermaria 2',
];

export const SUBBLOCOS_CADASTRADOS_MOCK = [
  'Enfermaria 1',
  'Enfermaria Dermato 1',
  'Enfermaria HB',
  'Enfermaria FAP 1',
  'Ambulatório 1',
  'Centro Cirúrgico',
  'UTI Adulto',
  'PS Clínico',
];

export function createEmptyTemplate(): Template {
  return {
    id: crypto.randomUUID(),
    nome: '',
    descricao: '',
    rotinas: [],
  };
}

export function createEmptyRotina(turno: 'manha' | 'tarde' | 'noite', corIndex: number): RotinaTemplate {
  const corKeys = ['rotina-1', 'rotina-2', 'rotina-3', 'rotina-4', 'rotina-5', 'rotina-6', 'rotina-7', 'rotina-8'];
  return {
    id: crypto.randomUUID(),
    titulo: '',
    turno,
    duracaoSemanas: 2,
    cor: corKeys[corIndex % corKeys.length],
    subblocos: [],
    visivel: true,
  };
}

export function createEmptySubbloco(): SubblocoConfig {
  return {
    id: crypto.randomUUID(),
    titulo: '',
    diasSemana: [1, 2, 3, 4, 5], // Seg-Sex by default
    horariosporDia: {},
  };
}

// Sample template for demonstration
export const sampleTemplate: Template = {
  id: 'template-1',
  nome: 'Template de teste',
  descricao: 'Template de teste',
  rotinas: [
    {
      id: 'rt-1',
      titulo: 'Rotina 1',
      turno: 'manha',
      duracaoSemanas: 2,
      cor: 'rotina-1',
      visivel: true,
      subblocos: [
        {
          id: 'sbc-1',
          titulo: 'Enf FAP 1',
          diasSemana: [1, 2, 3, 4, 5, 6, 0],
          horariosporDia: Object.fromEntries(
            [0, 1, 2, 3, 4, 5, 6].map(d => [d, { inicio: '07:00', fim: '12:00', preceptor: 'Dr. Roberto Silva', local: 'HELP' }])
          ),
        },
        {
          id: 'sbc-2',
          titulo: 'Enf Dermato 1',
          diasSemana: [1, 3, 5, 0],
          horariosporDia: Object.fromEntries(
            [1, 3, 5, 0].map(d => [d, { inicio: '07:00', fim: '12:00', preceptor: 'Dra. Patrícia Mendes', local: 'Santa Casa de Misericórdia do Recife' }])
          ),
        },
      ],
    },
    {
      id: 'rt-2',
      titulo: 'Rotina 2',
      turno: 'manha',
      duracaoSemanas: 2,
      cor: 'rotina-4',
      visivel: true,
      subblocos: [
        {
          id: 'sbc-3',
          titulo: 'Enf HB',
          diasSemana: [2, 4, 6],
          horariosporDia: Object.fromEntries(
            [2, 4, 6].map(d => [d, { inicio: '07:00', fim: '12:00', preceptor: 'Dr. Sandra Oliveira', local: 'Santa Casa de Misericórdia do Recife' }])
          ),
        },
      ],
    },
  ],
};
