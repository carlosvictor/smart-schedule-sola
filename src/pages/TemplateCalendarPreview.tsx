import { useState, useMemo, useEffect, useRef } from 'react';
import { Template, RotinaTemplate } from '@/types/template';
import { sampleTemplate } from '@/data/templateMockData';
import { Search, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TemplateViewMode = 'week' | 'day';

const HOUR_HEIGHT = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];
const DAY_LABELS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const rotinaColorMap: Record<string, { bg: string; border: string; text: string }> = {
  'rotina-1': { bg: 'hsl(262, 52%, 92%)', border: 'hsl(262, 52%, 47%)', text: 'hsl(262, 52%, 25%)' },
  'rotina-2': { bg: 'hsl(0, 70%, 92%)', border: 'hsl(0, 70%, 50%)', text: 'hsl(0, 70%, 25%)' },
  'rotina-3': { bg: 'hsl(142, 52%, 90%)', border: 'hsl(142, 52%, 36%)', text: 'hsl(142, 52%, 18%)' },
  'rotina-4': { bg: 'hsl(214, 82%, 92%)', border: 'hsl(214, 82%, 51%)', text: 'hsl(214, 82%, 25%)' },
  'rotina-5': { bg: 'hsl(36, 90%, 90%)', border: 'hsl(36, 90%, 50%)', text: 'hsl(36, 90%, 25%)' },
  'rotina-6': { bg: 'hsl(330, 65%, 92%)', border: 'hsl(330, 65%, 50%)', text: 'hsl(330, 65%, 25%)' },
  'rotina-7': { bg: 'hsl(180, 55%, 90%)', border: 'hsl(180, 55%, 40%)', text: 'hsl(180, 55%, 20%)' },
  'rotina-8': { bg: 'hsl(25, 80%, 90%)', border: 'hsl(25, 80%, 50%)', text: 'hsl(25, 80%, 25%)' },
};

const sidebarColorMap: Record<string, string> = {
  'rotina-1': 'hsl(262, 52%, 47%)',
  'rotina-2': 'hsl(0, 70%, 50%)',
  'rotina-3': 'hsl(142, 52%, 36%)',
  'rotina-4': 'hsl(214, 82%, 51%)',
  'rotina-5': 'hsl(36, 90%, 50%)',
  'rotina-6': 'hsl(330, 65%, 50%)',
  'rotina-7': 'hsl(180, 55%, 40%)',
  'rotina-8': 'hsl(25, 80%, 50%)',
};

interface TemplateEvent {
  id: string;
  rotinaId: string;
  rotinaTitulo: string;
  subblocoTitulo: string;
  dayOfWeek: number;
  inicio: string; // HH:mm
  fim: string;
  preceptor: string;
  local: string;
  cor: string;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':');
  return `${h}:${m}`;
}

function flattenTemplateToEvents(template: Template): TemplateEvent[] {
  const events: TemplateEvent[] = [];
  template.rotinas.forEach(rotina => {
    rotina.subblocos.forEach(sub => {
      sub.diasSemana.forEach(day => {
        const config = sub.horariosporDia[day];
        if (config) {
          events.push({
            id: `${rotina.id}-${sub.id}-${day}`,
            rotinaId: rotina.id,
            rotinaTitulo: rotina.titulo,
            subblocoTitulo: sub.titulo,
            dayOfWeek: day,
            inicio: config.inicio,
            fim: config.fim,
            preceptor: config.preceptor,
            local: config.local,
            cor: rotina.cor,
          });
        }
      });
    });
  });
  return events;
}

function layoutOverlapping(events: TemplateEvent[]) {
  if (events.length === 0) return [];
  const sorted = [...events].sort((a, b) => timeToMinutes(a.inicio) - timeToMinutes(b.inicio));
  const columns: TemplateEvent[][] = [];

  for (const ev of sorted) {
    let placed = false;
    for (const col of columns) {
      const last = col[col.length - 1];
      if (timeToMinutes(last.fim) <= timeToMinutes(ev.inicio)) {
        col.push(ev);
        placed = true;
        break;
      }
    }
    if (!placed) columns.push([ev]);
  }

  const totalCols = columns.length;
  const result: { event: TemplateEvent; colIndex: number; totalCols: number }[] = [];
  columns.forEach((col, colIdx) => {
    col.forEach(ev => result.push({ event: ev, colIndex: colIdx, totalCols }));
  });
  return result;
}

export default function TemplateCalendarPreview() {
  const [template, setTemplate] = useState<Template>(() => {
    try {
      const stored = sessionStorage.getItem('template-preview');
      return stored ? JSON.parse(stored) : sampleTemplate;
    } catch {
      return sampleTemplate;
    }
  });

  const [viewMode, setViewMode] = useState<TemplateViewMode>('week');
  const [selectedDay, setSelectedDay] = useState(1); // Monday
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [rotinas, setRotinas] = useState<RotinaTemplate[]>(template.rotinas);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 6 * HOUR_HEIGHT;
    }
  }, []);

  const visibleRotinaIds = useMemo(
    () => new Set(rotinas.filter(r => r.visivel).map(r => r.id)),
    [rotinas]
  );

  const allEvents = useMemo(() => flattenTemplateToEvents({ ...template, rotinas }), [template, rotinas]);

  const filteredEvents = useMemo(() => {
    let evts = allEvents.filter(e => visibleRotinaIds.has(e.rotinaId));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      evts = evts.filter(e =>
        e.subblocoTitulo.toLowerCase().includes(q) ||
        e.rotinaTitulo.toLowerCase().includes(q) ||
        e.preceptor.toLowerCase().includes(q) ||
        e.local.toLowerCase().includes(q)
      );
    }
    return evts;
  }, [allEvents, visibleRotinaIds, searchQuery]);

  const toggleRotina = (id: string) => {
    setRotinas(prev => prev.map(r => r.id === id ? { ...r, visivel: !r.visivel } : r));
  };

  const days = viewMode === 'week'
    ? [1, 2, 3, 4, 5, 6, 0] // Seg to Dom
    : [selectedDay];

  const navigateDay = (dir: 'prev' | 'next') => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    const idx = order.indexOf(selectedDay);
    const newIdx = dir === 'next' ? (idx + 1) % 7 : (idx - 1 + 7) % 7;
    setSelectedDay(order[newIdx]);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center h-14 px-4 border-b gap-4 bg-background shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span className="text-lg font-medium" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            {template.nome || 'Template'}
          </span>
        </div>

        {viewMode === 'day' && (
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateDay('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              {DAY_LABELS_FULL[selectedDay]}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateDay('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex-1" />

        {searchOpen ? (
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Pesquisar..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
            />
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
        )}

        <Select value={viewMode} onValueChange={v => setViewMode(v as TemplateViewMode)}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Semana</SelectItem>
            <SelectItem value="day">Dia</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Rotinas */}
        <aside className="w-56 border-r shrink-0 overflow-y-auto cal-scrollbar p-4">
          <h3 className="text-sm font-medium mb-3" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Rotinas
          </h3>
          <div className="flex flex-col gap-2">
            {rotinas.map(rotina => (
              <label
                key={rotina.id}
                className="flex items-center gap-2 cursor-pointer group text-sm hover:bg-accent rounded-md px-2 py-1.5 -mx-2 transition-colors"
              >
                <Checkbox
                  checked={rotina.visivel}
                  onCheckedChange={() => toggleRotina(rotina.id)}
                  className="border-2 data-[state=checked]:text-white"
                  style={{
                    borderColor: sidebarColorMap[rotina.cor],
                    backgroundColor: rotina.visivel ? sidebarColorMap[rotina.cor] : 'transparent',
                  }}
                />
                <span className="text-foreground text-[13px]">{rotina.titulo}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Calendar grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Day headers - no numbers, just day names */}
          <div className="flex border-b shrink-0" style={{ paddingLeft: 'var(--cal-time-col-width)' }}>
            {days.map(day => (
              <div
                key={day}
                className="flex-1 text-center py-3 border-l first:border-l-0 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => { setSelectedDay(day); setViewMode('day'); }}
              >
                <div className="cal-day-header text-xs">{DAY_LABELS[day]}</div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto cal-scrollbar relative">
            <div className="flex relative" style={{ height: 24 * HOUR_HEIGHT }}>
              {/* Time labels */}
              <div className="shrink-0" style={{ width: 'var(--cal-time-col-width)' }}>
                {HOURS.map(h => (
                  <div key={h} className="cal-time-label relative" style={{ height: HOUR_HEIGHT }}>
                    <span className="absolute -top-2 right-2">
                      {h === 0 ? '' : `${h} AM`.replace(/(\d+) AM/, (_, n) => {
                        const num = parseInt(n);
                        if (num < 12) return `${num} AM`;
                        if (num === 12) return '12 PM';
                        return `${num - 12} PM`;
                      })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map(day => {
                const dayEvents = filteredEvents.filter(e => e.dayOfWeek === day);
                const laid = layoutOverlapping(dayEvents);

                return (
                  <div key={day} className="flex-1 border-l relative">
                    {HOURS.map(h => (
                      <div key={h} className="cal-grid-line" style={{ height: HOUR_HEIGHT }} />
                    ))}

                    {laid.map(({ event, colIndex, totalCols }) => {
                      const startMin = timeToMinutes(event.inicio);
                      const endMin = timeToMinutes(event.fim);
                      const top = (startMin / 60) * HOUR_HEIGHT;
                      const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 20);
                      const width = `${100 / totalCols}%`;
                      const left = `${(colIndex / totalCols) * 100}%`;
                      const colors = rotinaColorMap[event.cor] ?? rotinaColorMap['rotina-1'];
                      const compact = height < 60;

                      return (
                        <div
                          key={event.id}
                          className="absolute z-10 px-0.5"
                          style={{ top, height, width, left }}
                        >
                          <div
                            className="cal-event overflow-hidden border-l-[3px] h-full"
                            style={{
                              backgroundColor: colors.bg,
                              borderLeftColor: colors.border,
                              color: colors.text,
                            }}
                          >
                            <div className="font-medium text-[11px] leading-tight truncate">
                              {event.rotinaTitulo}
                            </div>
                            <div className="text-[10px] opacity-80 truncate">{event.subblocoTitulo}</div>
                            <div className="text-[10px] opacity-80">
                              {formatTime(event.inicio)} – {formatTime(event.fim)}
                            </div>
                            {!compact && (
                              <>
                                <div className="text-[10px] opacity-80 truncate">{event.local}</div>
                                <div className="text-[10px] mt-0.5 truncate">
                                  Preceptor: {event.preceptor}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
