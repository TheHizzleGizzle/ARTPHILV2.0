import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Key, Sun, Moon, Eye, EyeOff, Check, Zap, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const SETTINGS_KEY = 'metaprompt_settings';

// Popular OpenRouter models for quick selection
const OPENROUTER_MODELS = [
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (OpenAI)' },
  { value: 'openai/gpt-4o', label: 'GPT-4o (OpenAI)' },
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku' },
  { value: 'google/gemini-pro-1.5', label: 'Gemini Pro 1.5' },
  { value: 'google/gemini-flash-1.5', label: 'Gemini Flash 1.5' },
  { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
  { value: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B' },
  { value: 'mistralai/mistral-large', label: 'Mistral Large' },
  { value: 'mistralai/mixtral-8x7b-instruct', label: 'Mixtral 8x7B' },
  { value: 'custom', label: '✏️ Custom Model...' },
];

export function getSettings() {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : {
      apiKey: '',
      provider: 'openai',
      model: '',
      customModel: '',
      darkMode: false,
    };
  } catch {
    return { apiKey: '', provider: 'openai', model: '', customModel: '', darkMode: false };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export default function SettingsPanel({ onClose, onSettingsChange }) {
  const [settings, setSettings] = useState(getSettings());
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [useCustomModel, setUseCustomModel] = useState(settings.model === 'custom' || (settings.customModel && !OPENROUTER_MODELS.find(m => m.value === settings.model)));

  useEffect(() => {
    // Apply dark mode on mount
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleSave = () => {
    saveSettings(settings);
    onSettingsChange?.(settings);
    setSaved(true);
    toast.success('Settings saved!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDarkModeToggle = (checked) => {
    const newSettings = { ...settings, darkMode: checked };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange?.(newSettings);
    
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Settings</h2>
                <p className="text-sm text-muted-foreground">Configure your experience</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Dark Mode Toggle */}
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.darkMode ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-warning" />
                  )}
                  <div>
                    <Label className="text-foreground font-medium">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                  </div>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* API Key Section */}
          <Card className="bg-muted/30 border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">AI API Key (Optional)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Bring your own API key for AI-powered generation. Leave empty to use template-based generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select
                  value={settings.provider}
                  onValueChange={(value) => {
                    setSettings({ ...settings, provider: value, model: '', customModel: '' });
                    setUseCustomModel(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT-4o-mini)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude Haiku)</SelectItem>
                    <SelectItem value="openrouter">OpenRouter (Multi-model)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* OpenRouter Model Selection */}
              {settings.provider === 'openrouter' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="model" className="flex items-center gap-2">
                      <Cpu className="w-3 h-3" />
                      Model
                    </Label>
                    <Select
                      value={useCustomModel ? 'custom' : (settings.model || 'openai/gpt-4o-mini')}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setUseCustomModel(true);
                          setSettings({ ...settings, model: 'custom' });
                        } else {
                          setUseCustomModel(false);
                          setSettings({ ...settings, model: value, customModel: '' });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPENROUTER_MODELS.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Model Input */}
                  {useCustomModel && (
                    <div className="space-y-2">
                      <Label htmlFor="customModel">Custom Model ID</Label>
                      <Input
                        id="customModel"
                        placeholder="e.g., openai/gpt-4-turbo, anthropic/claude-3-opus"
                        value={settings.customModel}
                        onChange={(e) => setSettings({ ...settings, customModel: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter any model from <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai/models</a>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showKey ? "text" : "password"}
                    placeholder={
                      settings.provider === "openai" ? "sk-..." : 
                      settings.provider === "anthropic" ? "sk-ant-..." :
                      settings.provider === "openrouter" ? "sk-or-..." : "Enter API key"
                    }
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your key is stored locally and never sent to our servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button
            variant="playful"
            onClick={handleSave}
            className="w-full gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
