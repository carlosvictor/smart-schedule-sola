import { Template } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StepIdentificacaoProps {
  template: Template;
  onChange: (t: Template) => void;
}

export default function StepIdentificacao({ template, onChange }: StepIdentificacaoProps) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-primary rounded" />
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Identificação do Template
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="template-nome" className="text-sm font-medium">
            Nome do Template *
          </Label>
          <Input
            id="template-nome"
            placeholder="Ex: Template Semestre 2025.1"
            className="mt-1.5"
            value={template.nome}
            onChange={e => onChange({ ...template, nome: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="template-desc" className="text-sm font-medium">
            Descrição
          </Label>
          <Textarea
            id="template-desc"
            placeholder="Descreva o objetivo deste template..."
            className="mt-1.5 min-h-[80px]"
            value={template.descricao}
            onChange={e => onChange({ ...template, descricao: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
