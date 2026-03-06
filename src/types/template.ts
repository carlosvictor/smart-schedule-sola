export type Turno = 'manha' | 'tarde' | 'noite';

export const TURNO_LABELS: Record<Turno, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
};

export const TURNO_COLORS: Record<Turno, { bg: string; header: string }> = {
  manha: { bg: 'hsl(30, 100%, 95%)', header: 'hsl(30, 80%, 60%)' },
  tarde: { bg: 'hsl(180, 60%, 93%)', header: 'hsl(180, 50%, 55%)' },
  noite: { bg: 'hsl(250, 60%, 95%)', header: 'hsl(250, 50%, 55%)' },
};

export interface SubblocoConfig {
  id: string;
  titulo: string;
  diasSemana: number[]; // 0=Dom, 1=Seg...6=Sab
  horariosporDia: Record<number, { inicio: string; fim: string; preceptor: string; local: string }>;
}

export interface RotinaTemplate {
  id: string;
  titulo: string;
  turno: Turno;
  duracaoSemanas: number;
  cor: string; // e.g. 'rotina-1'
  subblocos: SubblocoConfig[];
  visivel: boolean;
}

export interface Template {
  id: string;
  nome: string;
  descricao: string;
  rotinas: RotinaTemplate[];
}

export type WizardStep = 'identificacao' | 'turnos-rotinas' | 'ordenacao' | 'revisao';

export const WIZARD_STEPS: { key: WizardStep; label: string; number: number }[] = [
  { key: 'identificacao', label: 'Identificação', number: 1 },
  { key: 'turnos-rotinas', label: 'Turnos & Rotinas', number: 2 },
  { key: 'ordenacao', label: 'Ordenação', number: 3 },
  { key: 'revisao', label: 'Revisão', number: 4 },
];
