import { Users, MapPin, Clock, UsersRound, Layers, LayoutTemplate, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: Users, label: 'Usuários', key: 'usuarios' },
  { icon: MapPin, label: 'Locais', key: 'locais' },
  { icon: Clock, label: 'Frequência', key: 'frequencia' },
  { icon: UsersRound, label: 'Turmas e Grupos', key: 'turmas-grupos' },
  { icon: Layers, label: 'Subblocos', key: 'subblocos' },
  { icon: LayoutTemplate, label: 'Templates', key: 'templates' },
  { icon: Calendar, label: 'Cronogramas', key: 'cronogramas' },
];

interface ConfigSidebarProps {
  activeItem: string;
  onItemClick: (key: string) => void;
}

export default function ConfigSidebar({ activeItem, onItemClick }: ConfigSidebarProps) {
  return (
    <aside className="w-52 border-r bg-background flex flex-col shrink-0 h-full">
      <div className="px-4 py-5 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">S</span>
          </div>
          <div>
            <div className="text-sm font-semibold">SOLA</div>
            <div className="text-[10px] text-muted-foreground">Instituto Médico ABC</div>
          </div>
        </div>
      </div>

      <div className="px-3 pt-4 pb-2">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-2">Menu</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {menuItems.map(item => {
          const active = activeItem === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onItemClick(item.key)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                active
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 py-3 border-t">
        <span className="text-[10px] text-muted-foreground">Versão - 2.3.0</span>
      </div>
    </aside>
  );
}
