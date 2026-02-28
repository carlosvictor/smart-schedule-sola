import { useState, useMemo, useCallback } from 'react';
import { ViewMode } from '@/types/calendar';
import { rotinas as initialRotinas, subblocos } from '@/data/mockData';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import WeekView from '@/components/calendar/WeekView';
import ListView from '@/components/calendar/ListView';
import MonthView from '@/components/calendar/MonthView';

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [rotinas, setRotinas] = useState(initialRotinas);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleRotina = useCallback((id: string) => {
    setRotinas(prev =>
      prev.map(r => r.id === id ? { ...r, visivel: !r.visivel } : r)
    );
  }, []);

  const visibleRotinaIds = useMemo(
    () => new Set(rotinas.filter(r => r.visivel).map(r => r.id)),
    [rotinas]
  );

  const filteredEvents = useMemo(() => {
    let events = subblocos.filter(e => visibleRotinaIds.has(e.rotinaId));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(e =>
        e.titulo.toLowerCase().includes(q) ||
        e.preceptor.toLowerCase().includes(q) ||
        e.local.toLowerCase().includes(q) ||
        e.grupos.some(g => g.grupo.toLowerCase().includes(q) || g.turma.toLowerCase().includes(q))
      );
    }
    return events;
  }, [visibleRotinaIds, searchQuery]);

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-64 border-r shrink-0 overflow-y-auto cal-scrollbar">
            <CalendarSidebar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              rotinas={rotinas}
              onToggleRotina={toggleRotina}
            />
          </div>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              rotinas={rotinas}
            />
          )}
          {viewMode === 'day' && (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              rotinas={rotinas}
              dayCount={1}
            />
          )}
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              rotinas={rotinas}
              onDayClick={handleDayClick}
            />
          )}
          {viewMode === 'list' && (
            <ListView
              events={filteredEvents}
              rotinas={rotinas}
              currentDate={currentDate}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
