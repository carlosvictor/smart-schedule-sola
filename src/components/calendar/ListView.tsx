import { Subbloco, Rotina } from '@/types/calendar';
import { format, isToday, isBefore, isAfter, startOfDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import { AlertTriangle, MapPin, User, Users } from 'lucide-react';

interface ListViewProps {
  events: Subbloco[];
  rotinas: Rotina[];
  currentDate: Date;
}

const rotinaColorMap: Record<string, string> = {
  'rotina-1': 'hsl(262, 52%, 47%)',
  'rotina-2': 'hsl(0, 70%, 50%)',
  'rotina-3': 'hsl(142, 52%, 36%)',
  'rotina-4': 'hsl(214, 82%, 51%)',
  'rotina-5': 'hsl(36, 90%, 50%)',
  'rotina-6': 'hsl(330, 65%, 50%)',
  'rotina-7': 'hsl(180, 55%, 40%)',
  'rotina-8': 'hsl(25, 80%, 50%)',
};

export default function ListView({ events, rotinas, currentDate }: ListViewProps) {
  const rotinaMap = useMemo(() => {
    const m = new Map<string, Rotina>();
    rotinas.forEach(r => m.set(r.id, r));
    return m;
  }, [rotinas]);

  const grouped = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
    const groups: { date: Date; events: Subbloco[] }[] = [];

    sorted.forEach(ev => {
      const dayKey = format(ev.inicio, 'yyyy-MM-dd');
      const existing = groups.find(g => format(g.date, 'yyyy-MM-dd') === dayKey);
      if (existing) {
        existing.events.push(ev);
      } else {
        groups.push({ date: startOfDay(ev.inicio), events: [ev] });
      }
    });

    return groups;
  }, [events]);

  if (grouped.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Nenhum evento encontrado.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto cal-scrollbar p-6 max-w-4xl mx-auto w-full">
      {grouped.map(({ date, events: dayEvents }) => {
        const today = isToday(date);
        return (
          <div key={format(date, 'yyyy-MM-dd')} className="mb-6">
            <div className="flex items-center gap-3 mb-3 sticky top-0 bg-background py-2 z-10">
              <div className={`text-center ${today ? '' : ''}`}>
                <div className="cal-day-header text-[10px]">
                  {format(date, 'EEE', { locale: ptBR }).toUpperCase()}
                </div>
                <div className={today ? 'cal-today-circle text-lg' : 'text-2xl text-foreground'}>
                  {format(date, 'd')}
                </div>
              </div>
              <div className="flex-1 border-b" />
            </div>

            <div className="flex flex-col gap-2 pl-14">
              {dayEvents.map(ev => {
                const rotina = rotinaMap.get(ev.rotinaId);
                const color = rotinaColorMap[rotina?.cor ?? 'rotina-1'];
                const vagasEstouradas = ev.vagasDisponiveis < 0;

                return (
                  <div
                    key={ev.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{ev.titulo}</span>
                        {vagasEstouradas && (
                          <span className="flex items-center gap-1 text-[10px] text-destructive font-medium">
                            <AlertTriangle className="h-3 w-3" /> Vagas estouradas
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(ev.inicio, 'HH:mm')} – {format(ev.fim, 'HH:mm')}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {ev.local}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {ev.preceptor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {ev.totalAlunos} alunos
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ev.grupos.map((g, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {g.grupo} – {g.turma}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
