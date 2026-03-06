import { Check } from 'lucide-react';
import { WIZARD_STEPS, WizardStep } from '@/types/template';
import { cn } from '@/lib/utils';

interface WizardStepperProps {
  currentStep: WizardStep;
  completedSteps: Set<WizardStep>;
}

export default function WizardStepper({ currentStep, completedSteps }: WizardStepperProps) {
  const currentIdx = WIZARD_STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center gap-2">
      {WIZARD_STEPS.map((step, i) => {
        const isCompleted = completedSteps.has(step.key);
        const isCurrent = step.key === currentStep;
        const isPast = i < currentIdx;

        return (
          <div key={step.key} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-border" />}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                  isCompleted || isPast
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted || isPast ? <Check className="h-3.5 w-3.5" /> : step.number}
              </div>
              <span
                className={cn(
                  'text-xs whitespace-nowrap hidden lg:inline',
                  isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
