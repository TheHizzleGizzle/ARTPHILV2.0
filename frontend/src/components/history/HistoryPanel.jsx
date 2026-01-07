import React from 'react';
import { motion } from 'framer-motion';
import { X, History, Clock, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HistoryPanel({ history, onClose, onSelect, onClear }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
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
        initial={{ scale: 0.95, opacity: 0, x: 20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        exit={{ scale: 0.95, opacity: 0, x: 20 }}
        className="w-full max-w-lg max-h-[85vh] bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center">
                <History className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">History</h2>
                <p className="text-sm text-muted-foreground">{history.length} prompts generated</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClear} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* History list */}
        <ScrollArea className="h-[calc(85vh-120px)]">
          <div className="p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No prompts generated yet</p>
                <p className="text-sm text-muted-foreground">Your generated prompts will appear here</p>
              </div>
            ) : (
              history.slice().reverse().map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                    onClick={() => onSelect(entry)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-medium text-foreground truncate">
                              {entry.task.length > 50 ? entry.task.slice(0, 50) + '...' : entry.task}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(entry.createdAt)}
                            </span>
                            {entry.inputs && entry.inputs.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {entry.inputs.length} variables
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {entry.prompt.slice(0, 100)}...
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
