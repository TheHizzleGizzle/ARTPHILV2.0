import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Wand2, Copy, Download, History, BookOpen, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import WizardSteps from '@/components/wizard/WizardSteps';
import TaskStep from '@/components/wizard/TaskStep';
import InputsStep from '@/components/wizard/InputsStep';
import StructureStep from '@/components/wizard/StructureStep';
import InstructionsStep from '@/components/wizard/InstructionsStep';
import LivePreview from '@/components/preview/LivePreview';
import PromptLibrary from '@/components/library/PromptLibrary';
import HistoryPanel from '@/components/history/HistoryPanel';
import SettingsPanel, { getSettings, saveSettings } from '@/components/settings/SettingsPanel';
import { Button } from '@/components/ui/button';
import { generatePrompt } from '@/services/promptService';
import { saveToHistory, getHistory } from '@/services/historyService';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function MetapromptGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  
  const [formData, setFormData] = useState({
    task: '',
    inputs: [],
    structure: '',
    instructions: '',
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
    // Apply dark mode on mount
    const savedSettings = getSettings();
    setSettings(savedSettings);
    if (savedSettings.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    const newSettings = { ...settings, darkMode: newDarkMode };
    setSettings(newSettings);
    saveSettings(newSettings);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const steps = [
    { id: 0, title: 'Define Task', icon: '1' },
    { id: 1, title: 'Add Inputs', icon: '2' },
    { id: 2, title: 'Plan Structure', icon: '3' },
    { id: 3, title: 'Generate', icon: '4' },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePrompt(formData, BACKEND_URL, settings);
      setGeneratedPrompt(result.prompt);
      updateFormData('instructions', result.prompt);
      
      // Show provider info
      if (result.provider_used === 'openai') {
        toast.success('Generated with OpenAI!');
      } else if (result.provider_used === 'anthropic') {
        toast.success('Generated with Claude!');
      } else {
        toast.success('Generated with template!');
      }
      
      // Save to history
      const historyEntry = {
        id: Date.now(),
        task: formData.task,
        inputs: formData.inputs,
        prompt: result.prompt,
        provider: result.provider_used,
        createdAt: new Date().toISOString(),
      };
      saveToHistory(historyEntry);
      setHistory(getHistory());
      
      toast.success('Prompt generated successfully!');
    } catch (error) {
      toast.error('Failed to generate prompt. Please try again.');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt || formData.instructions);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    const content = generatedPrompt || formData.instructions;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metaprompt-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully!');
  };

  const handleSelectFromLibrary = (template) => {
    setFormData({
      task: template.task,
      inputs: template.inputs || [],
      structure: template.structure || '',
      instructions: '',
    });
    setShowLibrary(false);
    setCurrentStep(0);
    toast.success('Template loaded!');
  };

  const handleSelectFromHistory = (entry) => {
    setFormData({
      task: entry.task,
      inputs: entry.inputs || [],
      structure: '',
      instructions: entry.prompt,
    });
    setGeneratedPrompt(entry.prompt);
    setShowHistory(false);
    setCurrentStep(3);
    toast.success('Loaded from history!');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.task.trim().length > 10;
      case 1:
        return true; // Inputs are optional
      case 2:
        return true; // Structure is optional
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {currentStep === 0 && (
            <TaskStep
              value={formData.task}
              onChange={(val) => updateFormData('task', val)}
            />
          )}
          {currentStep === 1 && (
            <InputsStep
              inputs={formData.inputs}
              onChange={(val) => updateFormData('inputs', val)}
            />
          )}
          {currentStep === 2 && (
            <StructureStep
              value={formData.structure}
              onChange={(val) => updateFormData('structure', val)}
              task={formData.task}
              inputs={formData.inputs}
            />
          )}
          {currentStep === 3 && (
            <InstructionsStep
              formData={formData}
              generatedPrompt={generatedPrompt}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              onChange={(val) => {
                updateFormData('instructions', val);
                setGeneratedPrompt(val);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <Header
        onShowLibrary={() => setShowLibrary(true)}
        onShowHistory={() => setShowHistory(true)}
        onShowSettings={() => setShowSettings(true)}
        historyCount={history.length}
        darkMode={settings.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <main className="container mx-auto px-4 pt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Wizard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
          >
            <div className="p-6">
              <WizardSteps steps={steps} currentStep={currentStep} />
              
              <div className="mt-8 min-h-[400px]">
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="wizard"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                <div className="flex gap-3">
                  {currentStep === 3 && (generatedPrompt || formData.instructions) && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      variant="playful"
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="gap-2"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="playful"
                      onClick={handleGenerate}
                      disabled={isGenerating || !formData.task}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          Generate Prompt
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Live Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <LivePreview
              formData={formData}
              generatedPrompt={generatedPrompt}
              currentStep={currentStep}
            />
          </motion.div>
        </div>
      </main>

      {/* Library Modal */}
      <AnimatePresence>
        {showLibrary && (
          <PromptLibrary
            onClose={() => setShowLibrary(false)}
            onSelect={handleSelectFromLibrary}
          />
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <HistoryPanel
            history={history}
            onClose={() => setShowHistory(false)}
            onSelect={handleSelectFromHistory}
            onClear={() => {
              localStorage.removeItem('metaprompt_history');
              setHistory([]);
              toast.success('History cleared!');
            }}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            onSettingsChange={(newSettings) => setSettings(newSettings)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
