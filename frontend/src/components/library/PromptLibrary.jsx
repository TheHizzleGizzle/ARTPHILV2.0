import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, BookOpen, Target, MessageSquare, FileText, Calculator, Code, Sparkles, PenTool, Languages, Shield, Briefcase, Lightbulb, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const templates = [
  {
    id: 1,
    icon: Target,
    category: 'Customer Service',
    title: 'Customer Support Agent',
    description: 'Handle customer inquiries using FAQ knowledge base',
    task: 'Act as a polite customer success agent for a company. Use the provided FAQ to answer questions. Only answer questions covered in the FAQ.',
    inputs: ['FAQ', 'QUESTION'],
    structure: '1. Role definition\n2. Rules for interaction\n3. FAQ placement\n4. Output format with thinking tags',
  },
  {
    id: 2,
    icon: MessageSquare,
    category: 'Analysis',
    title: 'Sentence Comparison',
    description: 'Check if two sentences convey the same meaning',
    task: 'Check whether two sentences say the same thing. Compare their semantic meaning and provide a clear yes/no answer.',
    inputs: ['SENTENCE1', 'SENTENCE2'],
    structure: '1. Present both sentences\n2. Analysis (optional)\n3. Clear [YES] or [NO] answer',
  },
  {
    id: 3,
    icon: FileText,
    category: 'Research',
    title: 'Document Q&A',
    description: 'Answer questions with document references',
    task: 'Answer questions about a document and provide references. Extract relevant quotes and cite them in your answer.',
    inputs: ['DOCUMENT', 'QUESTION'],
    structure: '1. Document placement\n2. Quote extraction\n3. Answer with bracketed references',
  },
  {
    id: 4,
    icon: Calculator,
    category: 'Education',
    title: 'Socratic Math Tutor',
    description: 'Guide students through math problems with questions',
    task: 'Act as a Socratic tutor for mathematics. Help students learn by asking guiding questions instead of giving direct answers. Use inner monologue to track the correct solution.',
    inputs: ['MATH_QUESTION'],
    structure: '1. Role as Socratic tutor\n2. Inner monologue for solving\n3. Examples of interactions\n4. Student-focused responses',
  },
  {
    id: 5,
    icon: Code,
    category: 'Development',
    title: 'Function Caller',
    description: 'Answer questions using provided functions',
    task: 'Answer questions using functions that are provided. Analyze what information is needed and call appropriate functions to gather data.',
    inputs: ['QUESTION', 'FUNCTIONS'],
    structure: '1. Available functions listing\n2. Scratchpad for reasoning\n3. Function call format\n4. Answer synthesis',
  },
  {
    id: 6,
    icon: Sparkles,
    category: 'Creative',
    title: 'Content Summarizer',
    description: 'Create concise summaries of long content',
    task: 'Summarize the provided content into a concise format. Maintain key points while reducing length. Adapt tone based on content type.',
    inputs: ['CONTENT', 'TARGET_LENGTH'],
    structure: '1. Content analysis\n2. Key point extraction\n3. Summary generation\n4. Length check',
  },
  {
    id: 7,
    icon: PenTool,
    category: 'Creative',
    title: 'Creative Writer',
    description: 'Generate creative content in various styles',
    task: 'Act as a creative writer who can produce engaging content in different styles and formats. Adapt tone, vocabulary, and structure based on the requested style and audience.',
    inputs: ['TOPIC', 'STYLE', 'AUDIENCE'],
    structure: '1. Understand the creative brief\n2. Adapt writing style\n3. Generate content with creativity\n4. Polish and refine',
  },
  {
    id: 8,
    icon: Languages,
    category: 'Translation',
    title: 'Language Translator',
    description: 'Translate text while preserving meaning and nuance',
    task: 'Translate text from one language to another while preserving the original meaning, tone, and cultural nuances. Handle idioms and expressions appropriately.',
    inputs: ['TEXT', 'SOURCE_LANGUAGE', 'TARGET_LANGUAGE'],
    structure: '1. Analyze source text\n2. Identify nuances and idioms\n3. Translate with context\n4. Verify accuracy',
  },
  {
    id: 9,
    icon: Shield,
    category: 'Analysis',
    title: 'Content Moderator',
    description: 'Review content for policy violations',
    task: 'Act as a content moderator who reviews user-generated content against community guidelines. Identify potential violations, categorize them by severity, and recommend actions.',
    inputs: ['CONTENT', 'GUIDELINES'],
    structure: '1. Review guidelines\n2. Analyze content systematically\n3. Identify violations\n4. Recommend action with reasoning',
  },
  {
    id: 10,
    icon: Briefcase,
    category: 'Business',
    title: 'Email Composer',
    description: 'Draft professional emails for various scenarios',
    task: 'Compose professional emails tailored to specific business scenarios. Maintain appropriate tone, clarity, and structure while achieving the communication objective.',
    inputs: ['SCENARIO', 'RECIPIENT', 'KEY_POINTS'],
    structure: '1. Understand context\n2. Choose appropriate tone\n3. Structure email clearly\n4. Include call to action',
  },
  {
    id: 11,
    icon: Code,
    category: 'Development',
    title: 'Code Reviewer',
    description: 'Review code for bugs, style, and best practices',
    task: 'Act as a senior code reviewer. Analyze code for bugs, security issues, performance problems, and adherence to best practices. Provide constructive feedback with specific suggestions.',
    inputs: ['CODE', 'LANGUAGE', 'CONTEXT'],
    structure: '1. Understand code purpose\n2. Check for bugs and issues\n3. Evaluate style and practices\n4. Provide actionable feedback',
  },
  {
    id: 12,
    icon: Lightbulb,
    category: 'Education',
    title: 'Concept Explainer',
    description: 'Explain complex concepts in simple terms',
    task: 'Explain complex concepts in simple, understandable terms. Use analogies, examples, and step-by-step breakdowns. Adapt explanation depth based on the audience level.',
    inputs: ['CONCEPT', 'AUDIENCE_LEVEL'],
    structure: '1. Assess concept complexity\n2. Choose appropriate analogies\n3. Build understanding gradually\n4. Verify comprehension',
  },
  {
    id: 13,
    icon: Workflow,
    category: 'Business',
    title: 'Process Documenter',
    description: 'Create clear documentation for processes',
    task: 'Document business or technical processes in a clear, step-by-step format. Include prerequisites, detailed steps, expected outcomes, and troubleshooting tips.',
    inputs: ['PROCESS_NAME', 'PROCESS_DETAILS'],
    structure: '1. Overview and purpose\n2. Prerequisites list\n3. Step-by-step instructions\n4. Expected outcomes\n5. Troubleshooting',
  },
  {
    id: 14,
    icon: Target,
    category: 'Customer Service',
    title: 'Complaint Handler',
    description: 'Handle customer complaints with empathy',
    task: 'Act as a skilled customer service representative handling complaints. Show empathy, acknowledge concerns, investigate issues, and propose fair resolutions while maintaining brand voice.',
    inputs: ['COMPLAINT', 'CUSTOMER_HISTORY'],
    structure: '1. Acknowledge and empathize\n2. Investigate details\n3. Propose resolution\n4. Follow up plan',
  },
  {
    id: 15,
    icon: FileText,
    category: 'Research',
    title: 'Research Synthesizer',
    description: 'Synthesize information from multiple sources',
    task: 'Synthesize information from multiple sources into a coherent analysis. Identify common themes, contradictions, and gaps. Provide a balanced overview with proper attribution.',
    inputs: ['SOURCES', 'RESEARCH_QUESTION'],
    structure: '1. Review all sources\n2. Identify themes and patterns\n3. Note contradictions\n4. Synthesize findings',
  },
];

export default function PromptLibrary({ onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        className="w-full max-w-4xl max-h-[85vh] bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Prompt Library</h2>
                <p className="text-sm text-muted-foreground">Choose a template to get started</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates grid */}
        <ScrollArea className="h-[calc(85vh-180px)]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary/40 hover:shadow-md transition-all h-full flex flex-col"
                  onClick={() => onSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <template.icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3">{template.title}</CardTitle>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <div className="flex flex-wrap gap-1">
                      {template.inputs.map((input) => (
                        <Badge key={input} variant="outline" className="text-xs font-mono">
                          {`{$${input}}`}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
