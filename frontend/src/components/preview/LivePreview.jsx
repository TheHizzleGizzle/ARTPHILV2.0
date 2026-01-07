import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Code2, FileText, Variable, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LivePreview({ formData, generatedPrompt, currentStep }) {
  const { task, inputs, structure, instructions } = formData;
  const finalPrompt = generatedPrompt || instructions;

  const formatPromptPreview = () => {
    if (finalPrompt) return finalPrompt;
    
    let preview = '';
    
    if (task) {
      preview += `<Task>\n${task}\n</Task>\n\n`;
    }
    
    if (inputs.length > 0) {
      preview += `<Inputs>\n${inputs.map(i => `{$${i}}`).join('\n')}\n</Inputs>\n\n`;
    }
    
    if (structure) {
      preview += `<Instructions Structure>\n${structure}\n</Instructions Structure>\n\n`;
    }
    
    preview += '<Instructions>\n[Will be generated in the final step]\n</Instructions>';
    
    return preview;
  };

  return (
    <Card className="h-full bg-card shadow-lg border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
              <Eye className="w-4 h-4 text-secondary-foreground" />
            </div>
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {finalPrompt ? 'Complete' : 'Building...'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="preview" className="gap-2 text-sm">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2 text-sm">
              <FileText className="w-4 h-4" />
              Summary
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-0">
            <ScrollArea className="h-[480px] rounded-lg border border-border bg-muted/20 p-4">
              <pre className="text-sm font-mono whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {formatPromptPreview()}
              </pre>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="summary" className="mt-0">
            <div className="space-y-4">
              {/* Task Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Task</span>
                  {task && <Badge variant="secondary" className="text-xs">Defined</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {task ? (task.length > 150 ? task.slice(0, 150) + '...' : task) : 'Not defined yet'}
                </p>
              </motion.div>

              {/* Inputs Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Variable className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Input Variables</span>
                  <Badge variant="secondary" className="text-xs">{inputs.length}</Badge>
                </div>
                {inputs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {inputs.map((input) => (
                      <Badge key={input} variant="outline" className="font-mono text-xs">
                        {`{$${input}}`}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No variables added</p>
                )}
              </motion.div>

              {/* Structure Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Layout className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Structure</span>
                  {structure && <Badge variant="secondary" className="text-xs">Custom</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {structure ? (structure.length > 100 ? structure.slice(0, 100) + '...' : structure) : 'AI-determined structure'}
                </p>
              </motion.div>

              {/* Status */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`p-4 rounded-lg border ${finalPrompt ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}
              >
                <div className="flex items-center gap-2">
                  <Code2 className={`w-4 h-4 ${finalPrompt ? 'text-success' : 'text-warning'}`} />
                  <span className="font-medium text-foreground">
                    {finalPrompt ? 'Prompt Generated!' : 'Ready to Generate'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {finalPrompt 
                    ? `${finalPrompt.length} characters generated` 
                    : 'Complete the steps and click Generate'
                  }
                </p>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
