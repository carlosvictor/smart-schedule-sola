import { Subbloco, Rotina } from '@/types/calendar';
import { startOfWeek, addDays, isSameDay, format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EventCard from './EventCard';
import { useMemo, useRef, useEffect } from 'react';

interface WeekViewProps {
  currentDate: Date;
  events: Subbloco[];
  rotinas: Rotina[];
  dayCount?: number;
}

const HOUR_HEIGHT = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS_PT = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

function getEventPosition(event: Subbloco) {
  const startMinutes = event.inicio.getHours() * 60 + event.inicio.getMinutes();
  const endMinutes = event.fim.getHours() * 60 + event.fim.getMinutes();
  const top = (startMinutes / 60) * HOUR_HEIGHT;
  const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;
  return { top, height: Math.max(height, 20) };
}

function layoutOverlappingEvents(events: Subbloco[]) {
  if (events.length === 0) return [];

  const sorted = [...events].sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
  const columns: Subbloco[][] = [];

  for (const ev of sorted) {
    let placed = false;
    for (const col of columns) {
      const last = col[col.length - 1];
      if (last.fim.getTime() <= ev.inicio.getTime()) {
        col.push(ev);
        placed = true;
        break;
      }
    }
    if (!placed) columns.push([ev]);
  }

  const totalCols = columns.length;
  const result: { event: Subbloco; colIndex: number; totalCols: number }[] = [];
  columns.forEach((col, colIdx) => {
    col.forEach(ev => {
      result.push({ event: ev, colIndex: colIdx, totalCols });
    });
  });

  return result;
}

export default function WeekView({ currentDate, events, rotinas, dayCount = 7 }: WeekViewProps) {
  const weekStart = dayCount === 1 ? currentDate : startOfWeek(currentDate, { locale: ptBR });
  const days = Array.from({ length: dayCount }, (_, i) => addDays(weekStart, i));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 7 * HOUR_HEIGHT;
    }
  }, []);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Subbloco[]>();
    days.forEach(day => {
      const key = format(day, 'yyyy-MM-dd');
      map.set(key, events.filter(e => isSameDay(e.inicio, day)));
    });
    return map;
  }, [events, days]);

  const rotinaMap = useMemo(() => {
    const m = new Map<string, Rotina>();
    rotinas.forEach(r => m.set(r.id, r));
    return m;
  }, [rotinas]);

  // Current time indicator
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowTop = (nowMinutes / 60) * HOUR_HEIGHT;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Day headers */}
      <div className="flex border-b shrink-0" style={{ paddingLeft: 'var(--cal-time-col-width)' }}>
        {days.map((day, i) => {
          const today = isToday(day);
          return (
            <div key={i} className="flex-1 text-center py-2 border-l first:border-l-0">
              <div className="cal-day-header">{DAY_LABELS_PT[day.getDay()]}</div>
              <div className={`text-2xl mt-0.5 ${today ? '' : 'text-foreground'}`}>
                {today ? (
                  <span className="cal-today-circle mx-auto">{format(day, 'd')}</span>
                ) : (
                  format(day, 'd')
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto cal-scrollbar relative">
        <div className="flex relative" style={{ height: 24 * HOUR_HEIGHT }}>
          {/* Time labels */}
          <div className="shrink-0" style={{ width: 'var(--cal-time-col-width)' }}>
            {HOURS.map(h => (
              <div
                key={h}
                className="cal-time-label relative"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="absolute -top-2 right-2">
                  {h === 0 ? '' : `${h} AM`.replace(/(\d+) AM/, (_, n) => {
                    const num = parseInt(n);
                    if (num === 0) return '12 AM';
                    if (num < 12) return `${num} AM`;
                    if (num === 12) return '12 PM';
                    return `${num - 12} PM`;
                  })}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIdx) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay.get(key) ?? [];
            const laid = layoutOverlappingEvents(dayEvents);
            const today = isToday(day);

            return (
              <div key={dayIdx} className="flex-1 border-l relative">
                {/* Hour lines */}
                {HOURS.map(h => (
                  <div key={h} className="cal-grid-line" style={{ height: HOUR_HEIGHT }} />
                ))}

                {/* Current time line */}
                {today && (
                  <div
                    className="absolute left-0 right-0 z-20 pointer-events-none"
                    style={{ top: nowTop }}
                  >
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive -ml-1.5 shrink-0" />
                      <div className="flex-1 h-[2px] bg-destructive" />
                    </div>
                  </div>
                )}

                {/* Events */}
                {laid.map(({ event, colIndex, totalCols }) => {
                  const { top, height } = getEventPosition(event);
                  const width = `${100 / totalCols}%`;
                  const left = `${(colIndex / totalCols) * 100}%`;
                  const compact = height < 60;

                  return (
                    <div
                      key={event.id}
                      className="absolute z-10 px-0.5"
                      style={{ top, height, width, left }}
                    >
                      <EventCard
                        event={event}
                        rotina={rotinaMap.get(event.rotinaId)}
                        style={{ height: '100%', overflow: 'hidden' }}
                        compact={compact}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
