import { useState } from 'react';
import { Template, RotinaTemplate, SubblocoConfig, Turno, TURNO_LABELS, TURNO_COLORS } from '@/types/template';
import { createEmptyRotina, createEmptySubbloco, PRECEPTORES_MOCK, LOCAIS_MOCK, SUBBLOCOS_CADASTRADOS_MOCK } from '@/data/templateMockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import SubblocoCard from './SubblocoCard';

interface StepTurnosRotinasProps {
  template: Template;
  onChange: (t: Template) => void;
}

const TURNOS: Turno[] = ['manha', 'tarde', 'noite'];
const DIAS_SEMANA = [
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
];

function AutocompleteInput({ value, onChange, suggestions, placeholder }: {
  value: string; onChange: (v: string) => void; suggestions: string[]; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="h-8 text-xs"
      />
      {open && filtered.length > 0 && value && (
        <div className="absolute z-50 top-full left-0 right-0 bg-popover border rounded-md shadow-md mt-1 max-h-32 overflow-y-auto">
          {filtered.map(s => (
            <button
              key={s}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors"
              onMouseDown={() => { onChange(s); setOpen(false); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StepTurnosRotinas({ template, onChange }: StepTurnosRotinasProps) {
  const [expandedRotinas, setExpandedRotinas] = useState<Set<string>>(new Set());
  const [configSubbloco, setConfigSubbloco] = useState<{ rotinaId: string; subblocoId: string } | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedRotinas(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addRotina = (turno: Turno) => {
    const turnoRotinas = template.rotinas.filter(r => r.turno === turno);
    const newRotina = createEmptyRotina(turno, template.rotinas.length);
    newRotina.titulo = `Rotina ${turnoRotinas.length + 1}`;
    onChange({ ...template, rotinas: [...template.rotinas, newRotina] });
    setExpandedRotinas(prev => new Set(prev).add(newRotina.id));
  };

  const updateRotina = (id: string, patch: Partial<RotinaTemplate>) => {
    onChange({
      ...template,
      rotinas: template.rotinas.map(r => r.id === id ? { ...r, ...patch } : r),
    });
  };

  const removeRotina = (id: string) => {
    onChange({ ...template, rotinas: template.rotinas.filter(r => r.id !== id) });
  };

  const addSubbloco = (rotinaId: string) => {
    const sub = createEmptySubbloco();
    onChange({
      ...template,
      rotinas: template.rotinas.map(r =>
        r.id === rotinaId ? { ...r, subblocos: [...r.subblocos, sub] } : r
      ),
    });
  };

  const updateSubbloco = (rotinaId: string, subblocoId: string, patch: Partial<SubblocoConfig>) => {
    onChange({
      ...template,
      rotinas: template.rotinas.map(r =>
        r.id === rotinaId
          ? { ...r, subblocos: r.subblocos.map(s => s.id === subblocoId ? { ...s, ...patch } : s) }
          : r
      ),
    });
  };

  const removeSubbloco = (rotinaId: string, subblocoId: string) => {
    onChange({
      ...template,
      rotinas: template.rotinas.map(r =>
        r.id === rotinaId
          ? { ...r, subblocos: r.subblocos.filter(s => s.id !== subblocoId) }
          : r
      ),
    });
  };

  // Find current subbloco for modal
  const currentConfigRotina = configSubbloco ? template.rotinas.find(r => r.id === configSubbloco.rotinaId) : null;
  const currentConfigSubbloco = currentConfigRotina?.subblocos.find(s => s.id === configSubbloco?.subblocoId);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-primary rounded" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Turnos e Rotinas
        </h2>
      </div>

      <div className="space-y-6">
        {TURNOS.map(turno => {
          const turnoRotinas = template.rotinas.filter(r => r.turno === turno);
          const colors = TURNO_COLORS[turno];

          return (
            <div key={turno} className="rounded-lg overflow-hidden border" style={{ borderColor: colors.header }}>
              {/* Turno header */}
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ backgroundColor: colors.header }}>
                <span className="text-white text-sm font-medium">{TURNO_LABELS[turno]}</span>
                <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded-full">
                  {turnoRotinas.length} rotinas
                </span>
              </div>

              <div className="p-3 space-y-3" style={{ backgroundColor: colors.bg }}>
                {turnoRotinas.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Nenhuma rotina configurada neste turno
                  </p>
                ) : (
                  turnoRotinas.map((rotina, idx) => (
                    <div key={rotina.id} className="bg-background rounded-lg border">
                      {/* Rotina header */}
                      <div
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                        onClick={() => toggleExpanded(rotina.id)}
                      >
                        <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{rotina.titulo || 'Sem título'}</div>
                          <div className="text-xs text-muted-foreground">
                            📅 {rotina.duracaoSemanas} semanas · 📋 {rotina.subblocos.length} subbloco{rotina.subblocos.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); removeRotina(rotina.id); }}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                        {expandedRotinas.has(rotina.id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>

                      {/* Expanded content */}
                      {expandedRotinas.has(rotina.id) && (
                        <div className="px-4 pb-4 border-t space-y-4">
                          <div className="grid grid-cols-2 gap-4 pt-3">
                            <div>
                              <Label className="text-xs">Título da Rotina</Label>
                              <Input
                                className="mt-1 h-8 text-sm"
                                value={rotina.titulo}
                                onChange={e => updateRotina(rotina.id, { titulo: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Duração (semanas)</Label>
                              <Input
                                type="number"
                                min={1}
                                className="mt-1 h-8 text-sm"
                                value={rotina.duracaoSemanas}
                                onChange={e => updateRotina(rotina.id, { duracaoSemanas: parseInt(e.target.value) || 1 })}
                              />
                            </div>
                          </div>

                          {/* Subblocos */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-xs font-medium">Subblocos</Label>
                            </div>
                            <div className="space-y-2">
                              {rotina.subblocos.map(sub => (
                                <div key={sub.id} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                                  <div className="flex-1 min-w-0">
                                    <AutocompleteInput
                                      value={sub.titulo}
                                      onChange={v => updateSubbloco(rotina.id, sub.id, { titulo: v })}
                                      suggestions={SUBBLOCOS_CADASTRADOS_MOCK}
                                      placeholder="Nome do subbloco..."
                                    />
                                  </div>
                                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {sub.diasSemana.length} dias
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0"
                                    onClick={() => setConfigSubbloco({ rotinaId: rotina.id, subblocoId: sub.id })}
                                  >
                                    <Settings2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0"
                                    onClick={() => removeSubbloco(rotina.id, sub.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-xs h-8"
                              onClick={() => addSubbloco(rotina.id)}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              Adicionar Subbloco
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8"
                  onClick={() => addRotina(turno)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Adicionar Rotina
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subbloco Config Modal */}
      <Dialog open={!!configSubbloco} onOpenChange={open => !open && setConfigSubbloco(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              Configurar Subbloco: {currentConfigSubbloco?.titulo || 'Sem título'}
            </DialogTitle>
          </DialogHeader>

          {currentConfigSubbloco && configSubbloco && (
            <div className="space-y-4">
              {/* Day selection */}
              <div>
                <Label className="text-xs font-medium mb-2 block">Dias da Semana</Label>
                <div className="flex gap-2">
                  {DIAS_SEMANA.map(dia => (
                    <label key={dia.value} className="flex items-center gap-1.5 cursor-pointer">
                      <Checkbox
                        checked={currentConfigSubbloco.diasSemana.includes(dia.value)}
                        onCheckedChange={checked => {
                          const newDias = checked
                            ? [...currentConfigSubbloco.diasSemana, dia.value]
                            : currentConfigSubbloco.diasSemana.filter(d => d !== dia.value);
                          updateSubbloco(configSubbloco.rotinaId, configSubbloco.subblocoId, { diasSemana: newDias });
                        }}
                      />
                      <span className="text-xs">{dia.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Per-day config */}
              <div className="space-y-3">
                <Label className="text-xs font-medium">Configuração por dia</Label>
                {DIAS_SEMANA.filter(d => currentConfigSubbloco.diasSemana.includes(d.value)).map(dia => {
                  const config = currentConfigSubbloco.horariosporDia[dia.value] || { inicio: '07:00', fim: '12:00', preceptor: '', local: '' };
                  return (
                    <div key={dia.value} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-2 items-center">
                      <span className="text-xs font-medium text-muted-foreground">{dia.label}</span>
                      <Input
                        type="time"
                        className="h-8 text-xs"
                        value={config.inicio}
                        onChange={e => updateSubbloco(configSubbloco.rotinaId, configSubbloco.subblocoId, {
                          horariosporDia: { ...currentConfigSubbloco.horariosporDia, [dia.value]: { ...config, inicio: e.target.value } }
                        })}
                      />
                      <Input
                        type="time"
                        className="h-8 text-xs"
                        value={config.fim}
                        onChange={e => updateSubbloco(configSubbloco.rotinaId, configSubbloco.subblocoId, {
                          horariosporDia: { ...currentConfigSubbloco.horariosporDia, [dia.value]: { ...config, fim: e.target.value } }
                        })}
                      />
                      <AutocompleteInput
                        value={config.preceptor}
                        onChange={v => updateSubbloco(configSubbloco.rotinaId, configSubbloco.subblocoId, {
                          horariosporDia: { ...currentConfigSubbloco.horariosporDia, [dia.value]: { ...config, preceptor: v } }
                        })}
                        suggestions={PRECEPTORES_MOCK}
                        placeholder="Preceptor"
                      />
                      <AutocompleteInput
                        value={config.local}
                        onChange={v => updateSubbloco(configSubbloco.rotinaId, configSubbloco.subblocoId, {
                          horariosporDia: { ...currentConfigSubbloco.horariosporDia, [dia.value]: { ...config, local: v } }
                        })}
                        suggestions={LOCAIS_MOCK}
                        placeholder="Local"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => setConfigSubbloco(null)}>
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
