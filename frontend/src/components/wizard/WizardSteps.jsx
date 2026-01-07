import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WizardSteps({ steps, currentStep }) {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border mx-10" />
      <motion.div 
        className="absolute top-5 left-0 h-0.5 bg-primary mx-10 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentStep / (steps.length - 1) }}
        transition={{ duration: 0.3 }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 z-10",
                  isCompleted && "bg-primary text-primary-foreground shadow-glow",
                  isCurrent && "bg-primary text-primary-foreground shadow-glow scale-110",
                  isPending && "bg-muted text-muted-foreground border-2 border-border"
                )}
                initial={false}
                animate={isCurrent ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  step.icon
                )}
              </motion.div>
              
              <span className={cn(
                "mt-2 text-sm font-medium transition-colors",
                isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
