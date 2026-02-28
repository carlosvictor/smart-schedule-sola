import { Rotina, Subbloco, ViewMode } from '@/types/calendar';
import { format, addWeeks, subWeeks, addDays, subDays, addMonths, subMonths, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Search, Menu, List, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onToggleSidebar: () => void;
}

export default function CalendarHeader({
  currentDate,
  setCurrentDate,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onToggleSidebar,
}: CalendarHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = (dir: 'prev' | 'next') => {
    const fn = dir === 'next'
      ? viewMode === 'month' ? addMonths : viewMode === 'day' ? addDays : addWeeks
      : viewMode === 'month' ? subMonths : viewMode === 'day' ? subDays : subWeeks;
    setCurrentDate(fn(currentDate, 1));
  };

  const title = viewMode === 'day'
    ? format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : viewMode === 'month'
    ? format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })
    : format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <header className="flex items-center h-16 px-4 border-b gap-4 bg-background shrink-0">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="shrink-0">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-1 shrink-0">
        <CalendarDays className="h-6 w-6 text-primary" />
        <span className="text-xl font-medium hidden sm:inline" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          Agenda
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={() => setCurrentDate(new Date())}
      >
        Hoje
      </Button>

      <div className="flex items-center gap-0 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h1 className="text-lg font-normal capitalize whitespace-nowrap" style={{ fontFamily: "'Google Sans', sans-serif" }}>
        {title}
      </h1>

      <div className="flex-1" />

      {searchOpen ? (
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Pesquisar eventos..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
          />
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>
      )}

      <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Dia</SelectItem>
          <SelectItem value="week">Semana</SelectItem>
          <SelectItem value="month">Mês</SelectItem>
          <SelectItem value="list">Lista</SelectItem>
        </SelectContent>
      </Select>
    </header>
  );
}
