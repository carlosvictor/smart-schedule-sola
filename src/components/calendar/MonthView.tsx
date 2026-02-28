import { Subbloco, Rotina } from '@/types/calendar';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';

interface MonthViewProps {
  currentDate: Date;
  events: Subbloco[];
  rotinas: Rotina[];
  onDayClick: (date: Date) => void;
}

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

const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

export default function MonthView({ currentDate, events, rotinas, onDayClick }: MonthViewProps) {
  const rotinaMap = useMemo(() => {
    const m = new Map<string, Rotina>();
    rotinas.forEach(r => m.set(r.id, r));
    return m;
  }, [rotinas]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { locale: ptBR });
  const calEnd = endOfWeek(monthEnd, { locale: ptBR });

  const weeks: Date[][] = [];
  let d = calStart;
  let week: Date[] = [];
  while (d <= calEnd) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    d = addDays(d, 1);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b shrink-0">
        {WEEKDAYS.map(wd => (
          <div key={wd} className="cal-day-header text-center py-2 text-[11px]">{wd}</div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex-1 grid overflow-y-auto cal-scrollbar" style={{ gridTemplateRows: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b min-h-[100px]">
            {week.map((day, di) => {
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              const dayEvents = events.filter(e => isSameDay(e.inicio, day));

              return (
                <div
                  key={di}
                  className={`border-l first:border-l-0 p-1 cursor-pointer hover:bg-accent/50 transition-colors ${!inMonth ? 'bg-muted/30' : ''}`}
                  onClick={() => onDayClick(day)}
                >
                  <div className="text-right mb-1">
                    <span className={`text-xs inline-flex items-center justify-center w-6 h-6 rounded-full ${today ? 'bg-primary text-primary-foreground font-bold' : inMonth ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 3).map(ev => {
                      const rotina = rotinaMap.get(ev.rotinaId);
                      const colors = rotinaColorMap[rotina?.cor ?? 'rotina-1'];
                      return (
                        <div
                          key={ev.id}
                          className="text-[10px] truncate rounded px-1 py-0.5 leading-tight"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {format(ev.inicio, 'HH:mm')} {ev.titulo}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} mais</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
