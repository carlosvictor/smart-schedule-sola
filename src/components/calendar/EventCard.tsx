import { Subbloco, Rotina } from '@/types/calendar';
import { AlertTriangle } from 'lucide-react';

interface EventCardProps {
  event: Subbloco;
  rotina: Rotina | undefined;
  style?: React.CSSProperties;
  compact?: boolean;
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

export default function EventCard({ event, rotina, style, compact }: EventCardProps) {
  const colors = rotinaColorMap[rotina?.cor ?? 'rotina-1'] ?? rotinaColorMap['rotina-1'];
  const vagasEstouradas = event.vagasDisponiveis < 0;

  const startH = event.inicio.getHours();
  const startM = event.inicio.getMinutes().toString().padStart(2, '0');
  const endH = event.fim.getHours();
  const endM = event.fim.getMinutes().toString().padStart(2, '0');
  const timeStr = `${startH}h${startM !== '00' ? startM : ''} – ${endH}h${endM !== '00' ? endM : ''}`;

  return (
    <div
      className="cal-event overflow-hidden border-l-[3px]"
      style={{
        backgroundColor: colors.bg,
        borderLeftColor: colors.border,
        color: colors.text,
        ...style,
      }}
    >
      <div className="font-medium text-[11px] leading-tight truncate">{event.titulo}</div>
      <div className="text-[10px] opacity-80">{timeStr}</div>
      {!compact && (
        <>
          <div className="text-[10px] opacity-80">{event.local}</div>
          <div className="mt-1 text-[10px] leading-snug">
            <div className="font-medium">Preceptor: {event.preceptor}</div>
            <div>{event.totalAlunos} alunos</div>
            {event.grupos.map((g, i) => (
              <div key={i}>Grupo: {g.grupo} – Turma: {g.turma}</div>
            ))}
          </div>
          {vagasEstouradas && (
            <div className="flex items-center gap-1 mt-1 text-[10px] font-medium" style={{ color: 'hsl(0, 70%, 50%)' }}>
              <AlertTriangle className="h-3 w-3" />
              Vagas estouradas!
            </div>
          )}
        </>
      )}
    </div>
  );
}
