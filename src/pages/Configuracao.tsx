import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template, WizardStep, WIZARD_STEPS } from '@/types/template';
import { createEmptyTemplate, sampleTemplate } from '@/data/templateMockData';
import ConfigSidebar from '@/components/configuracao/ConfigSidebar';
import WizardStepper from '@/components/configuracao/WizardStepper';
import StepIdentificacao from '@/components/configuracao/steps/StepIdentificacao';
import StepTurnosRotinas from '@/components/configuracao/steps/StepTurnosRotinas';
import StepOrdenacao from '@/components/configuracao/steps/StepOrdenacao';
import StepRevisao from '@/components/configuracao/steps/StepRevisao';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, ArrowLeft } from 'lucide-react';

export default function Configuracao() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('templates');
  const [currentStep, setCurrentStep] = useState<WizardStep>('identificacao');
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());
  const [template, setTemplate] = useState<Template>(() => {
    // Start with sample template for demo
    return { ...sampleTemplate };
  });

  const stepIdx = WIZARD_STEPS.findIndex(s => s.key === currentStep);

  const goNext = () => {
    if (stepIdx < WIZARD_STEPS.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(WIZARD_STEPS[stepIdx + 1].key);
    }
  };

  const goPrev = () => {
    if (stepIdx > 0) {
      setCurrentStep(WIZARD_STEPS[stepIdx - 1].key);
    }
  };

  const handleSave = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    // Mock save
    alert('Template salvo com sucesso!');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ConfigSidebar activeItem={activeMenu} onItemClick={setActiveMenu} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top breadcrumb + stepper */}
        <header className="border-b px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Home</button>
            <span>›</span>
            <span>Templates</span>
            <span>›</span>
            <span className="text-foreground font-medium">Novo Template</span>
          </div>
          <WizardStepper currentStep={currentStep} completedSteps={completedSteps} />
        </header>

        {/* Template title bar */}
        <div className="px-6 py-4 flex items-center gap-3 border-b shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              {template.nome ? template.nome.substring(0, 2).toUpperCase() : 'NT'}
            </span>
          </div>
          <div>
            <h1 className="font-medium">{template.nome || 'Novo Template'}</h1>
            <p className="text-xs text-muted-foreground">{template.descricao || 'Sem descrição'}</p>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 cal-scrollbar">
          {currentStep === 'identificacao' && (
            <StepIdentificacao template={template} onChange={setTemplate} />
          )}
          {currentStep === 'turnos-rotinas' && (
            <StepTurnosRotinas template={template} onChange={setTemplate} />
          )}
          {currentStep === 'ordenacao' && (
            <StepOrdenacao template={template} onChange={setTemplate} />
          )}
          {currentStep === 'revisao' && (
            <StepRevisao template={template} />
          )}
        </div>

        {/* Footer navigation */}
        <div className="border-t px-6 py-3 flex items-center justify-between shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={goPrev}
            disabled={stepIdx === 0}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </Button>

          {stepIdx < WIZARD_STEPS.length - 1 ? (
            <Button size="sm" className="gap-1.5" onClick={goNext}>
              Continuar
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button size="sm" className="gap-1.5" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" />
              Salvar Template
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
