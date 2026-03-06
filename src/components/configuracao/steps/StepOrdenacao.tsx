import { Template, Turno, TURNO_LABELS, TURNO_COLORS } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { Info } from 'lucide-react';

interface StepOrdenacaoProps {
  template: Template;
  onChange: (t: Template) => void;
}

const TURNOS: Turno[] = ['manha', 'tarde', 'noite'];

export default function StepOrdenacao({ template, onChange }: StepOrdenacaoProps) {
  const moveRotina = (turno: Turno, index: number, dir: 'up' | 'down') => {
    const turnoRotinas = template.rotinas.filter(r => r.turno === turno);
    const otherRotinas = template.rotinas.filter(r => r.turno !== turno);
    const newIdx = dir === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= turnoRotinas.length) return;
    const arr = [...turnoRotinas];
    [arr[index], arr[newIdx]] = [arr[newIdx], arr[index]];
    onChange({ ...template, rotinas: [...otherRotinas, ...arr] });
  };

  const reverseOrder = (turno: Turno) => {
    const turnoRotinas = template.rotinas.filter(r => r.turno === turno);
    const otherRotinas = template.rotinas.filter(r => r.turno !== turno);
    onChange({ ...template, rotinas: [...otherRotinas, ...turnoRotinas.reverse()] });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-primary rounded" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Ordenação do Ciclo de Rotação
        </h2>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-start gap-2 mb-6">
        <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-primary">
          Arraste as rotinas para definir a sequência do ciclo. Os grupos seguirão esta ordem ao longo do cronograma.
        </p>
      </div>

      <div className="space-y-6">
        {TURNOS.map(turno => {
          const turnoRotinas = template.rotinas.filter(r => r.turno === turno);
          const colors = TURNO_COLORS[turno];

          return (
            <div key={turno} className="rounded-lg overflow-hidden border" style={{ borderColor: colors.header }}>
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: colors.header }}>
                <span className="text-white text-sm font-medium">{TURNO_LABELS[turno]}</span>
                <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded-full">
                  {turnoRotinas.length} rotinas
                </span>
              </div>

              <div className="p-3 space-y-2" style={{ backgroundColor: colors.bg }}>
                {turnoRotinas.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Nenhuma rotina configurada neste turno
                  </p>
                ) : (
                  <>
                    {turnoRotinas.map((rotina, idx) => (
                      <div key={rotina.id} className="flex items-center gap-3 px-4 py-3 bg-background rounded-lg border">
                        <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{rotina.titulo}</div>
                          <div className="text-xs text-muted-foreground">
                            📅 {rotina.duracaoSemanas} semanas · 📋 {rotina.subblocos.length} subbloco{rotina.subblocos.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={idx === 0}
                            onClick={() => moveRotina(turno, idx, 'up')}
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            disabled={idx === turnoRotinas.length - 1}
                            onClick={() => moveRotina(turno, idx, 'down')}
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                      onClick={() => reverseOrder(turno)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reverter ordem
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
