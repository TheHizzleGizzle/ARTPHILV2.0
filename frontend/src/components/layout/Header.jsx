import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, History, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Header({ onShowLibrary, onShowHistory, onShowSettings, historyCount, darkMode, onToggleDarkMode }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">MetaPrompt</h1>
              <p className="text-xs text-muted-foreground">AI Prompt Generator</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowLibrary}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHistory}
              className="gap-2 relative"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {historyCount > 9 ? '9+' : historyCount}
                </Badge>
              )}
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="h-8 w-8"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowSettings}
              className="h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
