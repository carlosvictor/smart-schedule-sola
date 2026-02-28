import { Rotina, Subbloco } from '@/types/calendar';

export const rotinas: Rotina[] = [
  { id: 'r1', nome: 'Rotina 1 - Manhã', cor: 'rotina-1', visivel: true },
  { id: 'r2', nome: 'Rotina 2 - Manhã', cor: 'rotina-2', visivel: true },
  { id: 'r3', nome: 'Rotina 3 - Manhã', cor: 'rotina-3', visivel: true },
  { id: 'r4', nome: 'Rotina 4 - Tarde', cor: 'rotina-4', visivel: true },
];

function getWeekDay(dayOffset: number, hour: number, minute = 0): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - currentDay);
  sunday.setHours(hour, minute, 0, 0);
  const target = new Date(sunday);
  target.setDate(sunday.getDate() + dayOffset);
  return target;
}

export const subblocos: Subbloco[] = [
  // Rotina 1 - Manhã (Mon-Sat, 8am-12pm)
  ...([1, 2, 3, 4, 5, 6] as number[]).map((day, i) => ({
    id: `sb-r1-${i}`,
    titulo: 'Subbloco 1',
    rotinaId: 'r1',
    inicio: getWeekDay(day, 8),
    fim: getWeekDay(day, 12),
    local: 'UPA Imbiribeira',
    preceptor: 'Dr. Fulano',
    grupos: [
      { grupo: 'G1', turma: 'P10' },
      { grupo: 'G1', turma: 'P11' },
    ],
    totalAlunos: 10,
    vagasDisponiveis: 2,
    vagasTotais: 12,
  })),
  // Rotina 2 - afternoon events (Mon, Wed, Fri)
  ...([1, 3, 5] as number[]).map((day, i) => ({
    id: `sb-r2-${i}`,
    titulo: 'Subbloco 1 da tarde',
    rotinaId: 'r2',
    inicio: getWeekDay(day, 14),
    fim: getWeekDay(day, 18),
    local: 'Hospital Central',
    preceptor: 'Dr. Sicrano',
    grupos: [
      { grupo: 'G2', turma: 'P10' },
      { grupo: 'G4', turma: 'P11' },
    ],
    totalAlunos: 4,
    vagasDisponiveis: 0,
    vagasTotais: 4,
  })),
  // Rotina 3 - overlapping afternoon (Tue, Thu, Sat)
  ...([2, 4, 6] as number[]).map((day, i) => ({
    id: `sb-r3-${i}`,
    titulo: 'Exemplo Subbloco 2 da tarde',
    rotinaId: 'r3',
    inicio: getWeekDay(day, 14),
    fim: getWeekDay(day, 18),
    local: 'Clínica Norte',
    preceptor: 'Dr. Sicrano',
    grupos: [
      { grupo: 'G2', turma: 'P10' },
      { grupo: 'G4', turma: 'P11' },
    ],
    totalAlunos: 4,
    vagasDisponiveis: 3,
    vagasTotais: 7,
  })),
  // Rotina 4 - overlapping with R2 on Mon, Wed, Fri afternoon
  ...([1, 3, 5] as number[]).map((day, i) => ({
    id: `sb-r4-${i}`,
    titulo: 'Exemplo Subbloco 2 da tarde',
    rotinaId: 'r4',
    inicio: getWeekDay(day, 14),
    fim: getWeekDay(day, 18),
    local: 'UBS Sul',
    preceptor: 'Dr. Beltrano',
    grupos: [
      { grupo: 'G3', turma: 'P10' },
    ],
    totalAlunos: 6,
    vagasDisponiveis: -1,
    vagasTotais: 5,
  })),
];
