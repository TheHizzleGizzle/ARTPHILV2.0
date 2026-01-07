import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Target, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const suggestions = [
  { icon: Target, text: "Act as a customer support agent" },
  { icon: MessageSquare, text: "Check if two sentences mean the same" },
  { icon: Lightbulb, text: "Answer questions about a document" },
];

export default function TaskStep({ value, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">What&apos;s your task?</h2>
        <p className="text-muted-foreground">
          Describe the task you want the AI assistant to perform. Be specific and clear.
        </p>
      </div>

      <Textarea
        placeholder="Example: Act as a math tutor who helps students learn by asking guiding questions instead of giving direct answers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[180px] text-base resize-none bg-muted/30 border-border focus:border-primary"
      />

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-warning" />
          Need inspiration? Try one of these:
        </p>
        
        <div className="grid gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all group"
                onClick={() => onChange(suggestion.text)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <suggestion.icon className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">{suggestion.text}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{value.length} characters</span>
        <span className={value.length >= 10 ? "text-success" : "text-warning"}>
          {value.length >= 10 ? "Ready to continue" : "Add more detail"}
        </span>
      </div>
    </div>
  );
}
