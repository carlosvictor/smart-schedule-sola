export interface Rotina {
  id: string;
  nome: string;
  cor: string; // CSS variable name like "rotina-1"
  visivel: boolean;
}

export interface Subbloco {
  id: string;
  titulo: string;
  rotinaId: string;
  inicio: Date;
  fim: Date;
  local: string;
  preceptor: string;
  grupos: { grupo: string; turma: string }[];
  totalAlunos: number;
  vagasDisponiveis: number;
  vagasTotais: number;
}

export type ViewMode = 'week' | 'day' | 'month' | 'list';
