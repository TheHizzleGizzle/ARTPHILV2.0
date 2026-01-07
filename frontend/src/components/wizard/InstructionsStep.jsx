import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, RefreshCw, Edit3 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function InstructionsStep({ formData, generatedPrompt, isGenerating, onGenerate, onChange }) {
  const hasPrompt = generatedPrompt || formData.instructions;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Generate Instructions</h2>
        <p className="text-muted-foreground">
          {hasPrompt 
            ? "Edit and refine your generated prompt below" 
            : "Click generate to create your AI-optimized prompt instructions"
          }
        </p>
      </div>

      {!hasPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              animate={isGenerating ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
            >
              {isGenerating ? (
                <RefreshCw className="w-12 h-12 text-primary animate-spin" />
              ) : (
                <Wand2 className="w-12 h-12 text-primary" />
              )}
            </motion.div>
            {!isGenerating && (
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-warning" />
              </motion.div>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isGenerating ? "Crafting your prompt..." : "Ready to Generate"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            {isGenerating 
              ? "Our AI is analyzing your task and creating optimized instructions"
              : "We'll create a detailed prompt template based on your task, inputs, and structure preferences"
            }
          </p>

          {!isGenerating && (
            <Button
              variant="playful"
              size="lg"
              onClick={onGenerate}
              disabled={!formData.task}
              className="gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Generate Prompt
            </Button>
          )}
        </motion.div>
      )}

      {hasPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Edit3 className="w-4 h-4" />
              <span>Edit your prompt below</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onGenerate}
              disabled={isGenerating}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>

          <Textarea
            value={generatedPrompt || formData.instructions}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[300px] font-mono text-sm resize-none bg-muted/30"
            placeholder="Your generated prompt will appear here..."
          />

          <Card className="bg-success/10 border-success/30">
            <CardContent className="p-3 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-success" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Prompt ready!</span>
                <span className="text-muted-foreground ml-2">Use the buttons below to copy or download</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
