import { SubblocoConfig } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Settings2, Trash2, MapPin, User, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const DIAS_SEMANA_SHORT: Record<number, string> = {
  0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb',
};

const ALL_DIAS = [1, 2, 3, 4, 5, 6, 0];

interface SubblocoCardProps {
  subbloco: SubblocoConfig;
  onConfigure: () => void;
  onRemove: () => void;
}

export default function SubblocoCard({ subbloco, onConfigure, onRemove }: SubblocoCardProps) {
  const preceptores = new Set<string>();
  const locais = new Set<string>();
  Object.values(subbloco.horariosporDia).forEach(cfg => {
    if (cfg.preceptor) preceptores.add(cfg.preceptor);
    if (cfg.local) locais.add(cfg.local);
  });

  const isConfigured = Object.keys(subbloco.horariosporDia).length > 0;

  return (
    <div className="rounded-lg border bg-card p-3 space-y-2.5 shadow-sm hover:shadow-md transition-shadow">
      {/* Title row */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-sm truncate">
          {subbloco.titulo || 'Sem título'}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove}>
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Day chips with hover cards */}
      <div className="flex gap-1 flex-wrap">
        {ALL_DIAS.map(d => {
          const active = subbloco.diasSemana.includes(d);
          const dayConfig = subbloco.horariosporDia[d];

          if (!active) {
            return (
              <span
                key={d}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-muted/40 text-muted-foreground border-transparent"
              >
                {DIAS_SEMANA_SHORT[d]}
              </span>
            );
          }

          return (
            <HoverCard key={d} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <span
                  className={cn(
                    'text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors cursor-default',
                    'bg-primary text-primary-foreground border-primary'
                  )}
                >
                  {DIAS_SEMANA_SHORT[d]}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-52 p-3" align="center" side="top">
                <p className="text-xs font-semibold mb-2">{DIAS_SEMANA_SHORT[d]}</p>
                {dayConfig ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Horário</span>
                      <span className="font-medium">{dayConfig.inicio} – {dayConfig.fim}</span>
                    </div>
                    {dayConfig.preceptor && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{dayConfig.preceptor}</span>
                      </div>
                    )}
                    {dayConfig.local && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{dayConfig.local}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Sem configuração</p>
                )}
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>

      {/* Info row: locais + preceptores */}
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <MapPin className="h-3 w-3" />
              <span>{locais.size} {locais.size === 1 ? 'local' : 'locais'}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <p className="text-xs font-medium mb-1.5">Locais</p>
            {locais.size === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum local configurado</p>
            ) : (
              <ul className="space-y-1">
                {[...locais].map(l => (
                  <li key={l} className="text-xs flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            )}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-3 w-3" />
              <span>{preceptores.size} {preceptores.size === 1 ? 'preceptor' : 'preceptores'}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <p className="text-xs font-medium mb-1.5">Preceptores</p>
            {preceptores.size === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum preceptor configurado</p>
            ) : (
              <ul className="space-y-1">
                {[...preceptores].map(p => (
                  <li key={p} className="text-xs flex items-center gap-1.5">
                    <User className="h-3 w-3 text-muted-foreground shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Configure CTA */}
      {isConfigured ? (
        <button
          onClick={onConfigure}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-0.5"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>Editar configuração</span>
        </button>
      ) : (
        <Button variant="outline" size="sm" className="w-full h-7 text-xs gap-1.5" onClick={onConfigure}>
          <Wrench className="h-3.5 w-3.5" />
          Configurar subbloco
        </Button>
      )}
    </div>
  );
}
