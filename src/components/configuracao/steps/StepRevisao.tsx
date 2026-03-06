import { Template, TURNO_LABELS } from '@/types/template';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface StepRevisaoProps {
  template: Template;
}

export default function StepRevisao({ template }: StepRevisaoProps) {
  const stats = useMemo(() => {
    const totalRotinas = template.rotinas.length;
    const turnosUsados = [...new Set(template.rotinas.map(r => r.turno))];
    const maxSemanas = template.rotinas.reduce((max, r) => Math.max(max, r.duracaoSemanas), 0);
    const preceptores = new Set<string>();
    template.rotinas.forEach(r =>
      r.subblocos.forEach(s =>
        Object.values(s.horariosporDia).forEach(h => {
          if (h.preceptor) preceptores.add(h.preceptor);
        })
      )
    );
    return { totalRotinas, turnosUsados, maxSemanas, preceptores: preceptores.size };
  }, [template]);

  const openCalendarPreview = () => {
    // Store template in sessionStorage for the preview page
    sessionStorage.setItem('template-preview', JSON.stringify(template));
    window.open('/template-preview', '_blank');
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-primary rounded" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Resumo e Confirmação
        </h2>
      </div>

      {/* Template info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <div className="w-6 h-6 rounded bg-primary" />
        </div>
        <div>
          <h3 className="font-medium">{template.nome || 'Sem nome'}</h3>
          <p className="text-xs text-muted-foreground">
            {stats.turnosUsados.map(t => TURNO_LABELS[t]).join(', ')} · {stats.totalRotinas} rotinas
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">📋</div>
          <div className="text-2xl font-semibold">{stats.totalRotinas}</div>
          <div className="text-xs text-muted-foreground uppercase">Rotinas</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">📅</div>
          <div className="text-2xl font-semibold">{stats.maxSemanas}</div>
          <div className="text-xs text-muted-foreground uppercase">Semanas</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">👤</div>
          <div className="text-2xl font-semibold">{stats.preceptores}</div>
          <div className="text-xs text-muted-foreground uppercase">Preceptores</div>
        </div>
      </div>

      {/* Calendar preview section */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-primary rounded" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Calendário do Template
        </h2>
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={openCalendarPreview}>
          <ExternalLink className="h-3.5 w-3.5" />
          Visualizar calendário
        </Button>
      </div>

      <div className="border rounded-lg p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Clique em "Visualizar calendário" para ver o template completo em uma nova aba com visualização semanal e diária.
        </p>
      </div>
    </div>
  );
}
