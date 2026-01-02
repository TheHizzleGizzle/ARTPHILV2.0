import React from 'react';
import { motion } from 'framer-motion';
import { Layout, FileText, ListOrdered, Layers } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const structureTemplates = [
  {
    id: 'simple',
    icon: FileText,
    title: 'Simple',
    description: 'Basic introduction and rules',
    template: `1. Role/Context explanation
2. Key rules and constraints
3. Example (if applicable)
4. Output format`,
  },
  {
    id: 'detailed',
    icon: ListOrdered,
    title: 'Detailed',
    description: 'Step-by-step with scratchpad',
    template: `1. Role description
2. Input variable placement
3. Important rules
4. Thinking process (scratchpad/inner monologue)
5. Examples with edge cases
6. Output format specification`,
  },
  {
    id: 'structured',
    icon: Layers,
    title: 'Structured',
    description: 'XML tags and clear sections',
    template: `1. Context and role in <context>
2. Input variables in <inputs>
3. Rules and constraints in <rules>
4. Examples in <examples>
5. Output in <answer> or custom tags`,
  },
];

export default function StructureStep({ value, onChange, task, inputs }) {
  const selectTemplate = (template) => {
    onChange(template.template);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Plan the Structure</h2>
        <p className="text-muted-foreground">
          How should the instructions be organized? Choose a template or customize.
        </p>
      </div>

      {/* Template selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {structureTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-primary/40",
                value === template.template && "border-primary shadow-glow"
              )}
              onClick={() => selectTemplate(template)}
            >
              <CardHeader className="p-4 pb-2">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
                  value === template.template ? "bg-primary/10" : "bg-muted"
                )}>
                  <template.icon className={cn(
                    "w-5 h-5",
                    value === template.template ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <CardTitle className="text-base">{template.title}</CardTitle>
                <CardDescription className="text-xs">{template.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom structure textarea */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Customize Structure (optional)
        </label>
        <Textarea
          placeholder="Describe how you want the prompt to be structured, or modify the template above..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[150px] text-sm resize-none bg-muted/30"
        />
      </div>

      {/* Context summary */}
      <Card className="bg-secondary/20 border-secondary/40">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Layout className="w-5 h-5 text-secondary-foreground mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Your prompt will include:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Task: {task ? task.slice(0, 50) + (task.length > 50 ? '...' : '') : 'Not defined'}</li>
                <li>• Variables: {inputs.length > 0 ? inputs.map(i => `{$${i}}`).join(', ') : 'None'}</li>
                <li>• Structure: {value ? 'Custom' : 'AI-determined'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
