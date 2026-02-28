import { Rotina } from '@/types/calendar';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';

interface CalendarSidebarProps {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  rotinas: Rotina[];
  onToggleRotina: (id: string) => void;
}

export default function CalendarSidebar({ currentDate, setCurrentDate, rotinas, onToggleRotina }: CalendarSidebarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { locale: ptBR });
  const calEnd = endOfWeek(monthEnd, { locale: ptBR });

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

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

  return (
    <aside className="flex flex-col gap-6 py-4 px-3">
      {/* Mini Calendar */}
      <div>
        <div className="text-sm font-medium mb-2 capitalize" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </div>
        <div className="grid grid-cols-7 gap-0 text-center">
          {weekDays.map((wd, i) => (
            <div key={i} className="text-[10px] text-muted-foreground font-medium py-1">{wd}</div>
          ))}
          {days.map((day, i) => {
            const inMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            const selected = isSameDay(day, currentDate);
            return (
              <button
                key={i}
                onClick={() => setCurrentDate(day)}
                className={`
                  text-xs w-7 h-7 rounded-full flex items-center justify-center transition-colors
                  ${!inMonth ? 'text-muted-foreground/40' : 'text-foreground'}
                  ${today && !selected ? 'text-primary font-bold' : ''}
                  ${selected ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-accent'}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rotinas */}
      <div>
        <h3 className="text-sm font-medium mb-3" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          Rotinas
        </h3>
        <div className="flex flex-col gap-2">
          {rotinas.map((rotina) => (
            <label
              key={rotina.id}
              className="flex items-center gap-2 cursor-pointer group text-sm hover:bg-accent rounded-md px-2 py-1.5 -mx-2 transition-colors"
            >
              <Checkbox
                checked={rotina.visivel}
                onCheckedChange={() => onToggleRotina(rotina.id)}
                className="border-2 data-[state=checked]:text-white"
                style={{
                  borderColor: rotinaColorMap[rotina.cor],
                  backgroundColor: rotina.visivel ? rotinaColorMap[rotina.cor] : 'transparent',
                }}
              />
              <span className="text-foreground text-[13px]">{rotina.nome}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
