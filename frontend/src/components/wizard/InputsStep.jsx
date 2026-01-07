import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Variable, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function InputsStep({ inputs, onChange }) {
  const [newInput, setNewInput] = useState('');

  const addInput = () => {
    if (newInput.trim() && !inputs.includes(newInput.trim().toUpperCase())) {
      const formatted = newInput.trim().toUpperCase().replace(/\s+/g, '_');
      onChange([...inputs, formatted]);
      setNewInput('');
    }
  };

  const removeInput = (inputToRemove) => {
    onChange(inputs.filter(input => input !== inputToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInput();
    }
  };

  const commonInputs = ['DOCUMENT', 'QUESTION', 'CONTEXT', 'USER_INPUT', 'DATA', 'TOPIC'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Define Input Variables</h2>
        <p className="text-muted-foreground">
          What information will be provided each time this prompt is used?
        </p>
      </div>

      {/* Input field */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Variable className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Enter variable name (e.g., DOCUMENT)"
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={addInput} variant="playful" disabled={!newInput.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Current inputs */}
      <div className="min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {inputs.length > 0 ? (
            <motion.div className="flex flex-wrap gap-2">
              {inputs.map((input, index) => (
                <motion.div
                  key={input}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Badge
                    variant="secondary"
                    className="h-9 px-4 gap-2 text-sm font-mono hover:bg-secondary/80"
                  >
                    <span className="text-primary">{`{$${input}}`}</span>
                    <button
                      onClick={() => removeInput(input)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Variable className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No variables added yet</p>
              <p className="text-sm">Add variables that will be replaced with actual values</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Common suggestions */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Common input variables:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {commonInputs.map((input) => (
              <TooltipProvider key={input}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-mono"
                      onClick={() => {
                        if (!inputs.includes(input)) {
                          onChange([...inputs, input]);
                        }
                      }}
                      disabled={inputs.includes(input)}
                    >
                      {`{$${input}}`}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to add {input}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
