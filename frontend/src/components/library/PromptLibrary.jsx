import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, BookOpen, Target, MessageSquare, FileText, Calculator, Code, Sparkles, PenTool, Languages, Shield, Briefcase, Lightbulb, Workflow, Brain, Scale, Heart, Megaphone, Database, TestTube, Palette, Music, Camera, Users, TrendingUp, Clipboard, Zap, Globe, Lock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const templates = [
  // Customer Service (5)
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
    icon: Target,
    category: 'Customer Service',
    title: 'Complaint Handler',
    description: 'Handle customer complaints with empathy',
    task: 'Act as a skilled customer service representative handling complaints. Show empathy, acknowledge concerns, investigate issues, and propose fair resolutions while maintaining brand voice.',
    inputs: ['COMPLAINT', 'CUSTOMER_HISTORY'],
    structure: '1. Acknowledge and empathize\n2. Investigate details\n3. Propose resolution\n4. Follow up plan',
  },
  {
    id: 3,
    icon: Heart,
    category: 'Customer Service',
    title: 'Feedback Collector',
    description: 'Gather and analyze customer feedback',
    task: 'Act as a feedback specialist who collects customer opinions, categorizes sentiment, identifies trends, and provides actionable insights for product improvement.',
    inputs: ['FEEDBACK_DATA', 'PRODUCT_CONTEXT'],
    structure: '1. Categorize feedback\n2. Analyze sentiment\n3. Identify patterns\n4. Recommend actions',
  },
  {
    id: 4,
    icon: Users,
    category: 'Customer Service',
    title: 'Onboarding Guide',
    description: 'Help new users get started with a product',
    task: 'Guide new users through product onboarding. Explain features step-by-step, anticipate common questions, and ensure users feel confident using the product.',
    inputs: ['PRODUCT_INFO', 'USER_GOAL'],
    structure: '1. Welcome and overview\n2. Step-by-step guidance\n3. Pro tips\n4. Next steps',
  },
  {
    id: 5,
    icon: Award,
    category: 'Customer Service',
    title: 'Loyalty Program Expert',
    description: 'Explain rewards and benefits to customers',
    task: 'Act as a loyalty program specialist who explains benefits, helps customers maximize rewards, and encourages engagement with the program.',
    inputs: ['PROGRAM_DETAILS', 'CUSTOMER_STATUS'],
    structure: '1. Current status overview\n2. Available benefits\n3. Recommendations\n4. How to earn more',
  },
  
  // Analysis (5)
  {
    id: 6,
    icon: MessageSquare,
    category: 'Analysis',
    title: 'Sentence Comparison',
    description: 'Check if two sentences convey the same meaning',
    task: 'Check whether two sentences say the same thing. Compare their semantic meaning and provide a clear yes/no answer.',
    inputs: ['SENTENCE1', 'SENTENCE2'],
    structure: '1. Present both sentences\n2. Analysis (optional)\n3. Clear [YES] or [NO] answer',
  },
  {
    id: 7,
    icon: Shield,
    category: 'Analysis',
    title: 'Content Moderator',
    description: 'Review content for policy violations',
    task: 'Act as a content moderator who reviews user-generated content against community guidelines. Identify potential violations, categorize them by severity, and recommend actions.',
    inputs: ['CONTENT', 'GUIDELINES'],
    structure: '1. Review guidelines\n2. Analyze content systematically\n3. Identify violations\n4. Recommend action with reasoning',
  },
  {
    id: 8,
    icon: TrendingUp,
    category: 'Analysis',
    title: 'Sentiment Analyzer',
    description: 'Analyze emotional tone of text',
    task: 'Analyze the sentiment and emotional tone of provided text. Identify positive, negative, and neutral elements. Provide an overall assessment with supporting evidence.',
    inputs: ['TEXT', 'CONTEXT'],
    structure: '1. Overall sentiment score\n2. Key positive points\n3. Key negative points\n4. Nuanced analysis',
  },
  {
    id: 9,
    icon: Scale,
    category: 'Analysis',
    title: 'Argument Evaluator',
    description: 'Assess the strength of arguments',
    task: 'Evaluate the logical strength of arguments. Identify premises, conclusions, logical fallacies, and missing evidence. Provide a balanced assessment.',
    inputs: ['ARGUMENT', 'CONTEXT'],
    structure: '1. Identify claims\n2. Evaluate evidence\n3. Check logic\n4. Overall assessment',
  },
  {
    id: 10,
    icon: Brain,
    category: 'Analysis',
    title: 'Bias Detector',
    description: 'Identify potential biases in content',
    task: 'Analyze content for potential biases including political, cultural, gender, or commercial bias. Provide specific examples and suggestions for more balanced presentation.',
    inputs: ['CONTENT', 'TOPIC'],
    structure: '1. Type of bias identified\n2. Specific examples\n3. Impact assessment\n4. Neutralization suggestions',
  },
  
  // Research (5)
  {
    id: 11,
    icon: FileText,
    category: 'Research',
    title: 'Document Q&A',
    description: 'Answer questions with document references',
    task: 'Answer questions about a document and provide references. Extract relevant quotes and cite them in your answer.',
    inputs: ['DOCUMENT', 'QUESTION'],
    structure: '1. Document placement\n2. Quote extraction\n3. Answer with bracketed references',
  },
  {
    id: 12,
    icon: FileText,
    category: 'Research',
    title: 'Research Synthesizer',
    description: 'Synthesize information from multiple sources',
    task: 'Synthesize information from multiple sources into a coherent analysis. Identify common themes, contradictions, and gaps. Provide a balanced overview with proper attribution.',
    inputs: ['SOURCES', 'RESEARCH_QUESTION'],
    structure: '1. Review all sources\n2. Identify themes and patterns\n3. Note contradictions\n4. Synthesize findings',
  },
  {
    id: 13,
    icon: Globe,
    category: 'Research',
    title: 'Fact Checker',
    description: 'Verify claims and statements',
    task: 'Verify the accuracy of claims and statements. Research evidence, identify reliable sources, and provide a verdict with confidence level.',
    inputs: ['CLAIM', 'CONTEXT'],
    structure: '1. State the claim\n2. Evidence review\n3. Source evaluation\n4. Verdict with confidence',
  },
  {
    id: 14,
    icon: Database,
    category: 'Research',
    title: 'Data Interpreter',
    description: 'Explain data and statistics clearly',
    task: 'Interpret data, statistics, and research findings for a general audience. Explain methodology, significance, limitations, and practical implications.',
    inputs: ['DATA', 'AUDIENCE'],
    structure: '1. Key findings summary\n2. Methodology explanation\n3. Limitations\n4. Practical implications',
  },
  {
    id: 15,
    icon: BookOpen,
    category: 'Research',
    title: 'Literature Reviewer',
    description: 'Summarize academic literature on a topic',
    task: 'Review and summarize academic literature on a specific topic. Identify key theories, methodologies, findings, and gaps in current research.',
    inputs: ['TOPIC', 'SCOPE'],
    structure: '1. Overview of field\n2. Key theories\n3. Major findings\n4. Research gaps',
  },
  
  // Education (5)
  {
    id: 16,
    icon: Calculator,
    category: 'Education',
    title: 'Socratic Math Tutor',
    description: 'Guide students through math problems with questions',
    task: 'Act as a Socratic tutor for mathematics. Help students learn by asking guiding questions instead of giving direct answers. Use inner monologue to track the correct solution.',
    inputs: ['MATH_QUESTION'],
    structure: '1. Role as Socratic tutor\n2. Inner monologue for solving\n3. Examples of interactions\n4. Student-focused responses',
  },
  {
    id: 17,
    icon: Lightbulb,
    category: 'Education',
    title: 'Concept Explainer',
    description: 'Explain complex concepts in simple terms',
    task: 'Explain complex concepts in simple, understandable terms. Use analogies, examples, and step-by-step breakdowns. Adapt explanation depth based on the audience level.',
    inputs: ['CONCEPT', 'AUDIENCE_LEVEL'],
    structure: '1. Assess concept complexity\n2. Choose appropriate analogies\n3. Build understanding gradually\n4. Verify comprehension',
  },
  {
    id: 18,
    icon: TestTube,
    category: 'Education',
    title: 'Quiz Generator',
    description: 'Create educational quizzes and assessments',
    task: 'Generate educational quiz questions on a given topic. Include various question types, difficulty levels, and detailed answer explanations.',
    inputs: ['TOPIC', 'DIFFICULTY', 'NUM_QUESTIONS'],
    structure: '1. Learning objectives\n2. Question variety\n3. Answer key\n4. Explanations',
  },
  {
    id: 19,
    icon: Clipboard,
    category: 'Education',
    title: 'Study Guide Creator',
    description: 'Create comprehensive study materials',
    task: 'Create a comprehensive study guide for a topic. Include key concepts, definitions, examples, practice problems, and memory aids.',
    inputs: ['SUBJECT', 'LEVEL'],
    structure: '1. Overview\n2. Key concepts\n3. Examples\n4. Practice exercises\n5. Summary',
  },
  {
    id: 20,
    icon: Brain,
    category: 'Education',
    title: 'Learning Path Designer',
    description: 'Design personalized learning journeys',
    task: 'Design a personalized learning path for a student. Assess current knowledge, identify goals, and create a structured curriculum with milestones.',
    inputs: ['CURRENT_LEVEL', 'GOAL', 'TIMEFRAME'],
    structure: '1. Assessment\n2. Goals definition\n3. Weekly plan\n4. Resources\n5. Milestones',
  },
  
  // Development (5)
  {
    id: 21,
    icon: Code,
    category: 'Development',
    title: 'Function Caller',
    description: 'Answer questions using provided functions',
    task: 'Answer questions using functions that are provided. Analyze what information is needed and call appropriate functions to gather data.',
    inputs: ['QUESTION', 'FUNCTIONS'],
    structure: '1. Available functions listing\n2. Scratchpad for reasoning\n3. Function call format\n4. Answer synthesis',
  },
  {
    id: 22,
    icon: Code,
    category: 'Development',
    title: 'Code Reviewer',
    description: 'Review code for bugs, style, and best practices',
    task: 'Act as a senior code reviewer. Analyze code for bugs, security issues, performance problems, and adherence to best practices. Provide constructive feedback with specific suggestions.',
    inputs: ['CODE', 'LANGUAGE', 'CONTEXT'],
    structure: '1. Understand code purpose\n2. Check for bugs and issues\n3. Evaluate style and practices\n4. Provide actionable feedback',
  },
  {
    id: 23,
    icon: Lock,
    category: 'Development',
    title: 'Security Auditor',
    description: 'Identify security vulnerabilities in code',
    task: 'Audit code for security vulnerabilities. Identify potential attack vectors, classify severity, and provide remediation recommendations.',
    inputs: ['CODE', 'APPLICATION_TYPE'],
    structure: '1. Vulnerability scan\n2. Risk classification\n3. Attack scenarios\n4. Remediation steps',
  },
  {
    id: 24,
    icon: Zap,
    category: 'Development',
    title: 'Code Optimizer',
    description: 'Improve code performance and efficiency',
    task: 'Analyze code for performance bottlenecks and optimization opportunities. Suggest improvements with benchmarks and trade-off analysis.',
    inputs: ['CODE', 'PERFORMANCE_GOALS'],
    structure: '1. Current analysis\n2. Bottlenecks identified\n3. Optimization suggestions\n4. Trade-offs',
  },
  {
    id: 25,
    icon: FileText,
    category: 'Development',
    title: 'API Documentation Writer',
    description: 'Create clear API documentation',
    task: 'Write comprehensive API documentation. Include endpoints, parameters, request/response examples, error handling, and usage guidelines.',
    inputs: ['API_SPEC', 'AUDIENCE'],
    structure: '1. Overview\n2. Authentication\n3. Endpoints\n4. Examples\n5. Error codes',
  },
  
  // Creative (5)
  {
    id: 26,
    icon: Sparkles,
    category: 'Creative',
    title: 'Content Summarizer',
    description: 'Create concise summaries of long content',
    task: 'Summarize the provided content into a concise format. Maintain key points while reducing length. Adapt tone based on content type.',
    inputs: ['CONTENT', 'TARGET_LENGTH'],
    structure: '1. Content analysis\n2. Key point extraction\n3. Summary generation\n4. Length check',
  },
  {
    id: 27,
    icon: PenTool,
    category: 'Creative',
    title: 'Creative Writer',
    description: 'Generate creative content in various styles',
    task: 'Act as a creative writer who can produce engaging content in different styles and formats. Adapt tone, vocabulary, and structure based on the requested style and audience.',
    inputs: ['TOPIC', 'STYLE', 'AUDIENCE'],
    structure: '1. Understand the creative brief\n2. Adapt writing style\n3. Generate content with creativity\n4. Polish and refine',
  },
  {
    id: 28,
    icon: Megaphone,
    category: 'Creative',
    title: 'Marketing Copywriter',
    description: 'Write compelling marketing copy',
    task: 'Create persuasive marketing copy that drives action. Understand the product, target audience, and desired outcome to craft compelling messages.',
    inputs: ['PRODUCT', 'AUDIENCE', 'GOAL'],
    structure: '1. Hook/Headline\n2. Pain points\n3. Solution benefits\n4. Call to action',
  },
  {
    id: 29,
    icon: Music,
    category: 'Creative',
    title: 'Story Generator',
    description: 'Create engaging narratives and stories',
    task: 'Generate creative stories with compelling characters, plot development, and engaging narrative. Adapt genre, tone, and complexity as needed.',
    inputs: ['GENRE', 'THEME', 'LENGTH'],
    structure: '1. Setting and characters\n2. Rising action\n3. Climax\n4. Resolution',
  },
  {
    id: 30,
    icon: Palette,
    category: 'Creative',
    title: 'Brand Voice Developer',
    description: 'Define and maintain brand voice',
    task: 'Develop and document a consistent brand voice. Create guidelines for tone, vocabulary, and messaging that reflect brand values and resonate with the target audience.',
    inputs: ['BRAND_INFO', 'TARGET_AUDIENCE'],
    structure: '1. Brand personality\n2. Tone guidelines\n3. Vocabulary list\n4. Do/Don\'t examples',
  },
  
  // Translation (3)
  {
    id: 31,
    icon: Languages,
    category: 'Translation',
    title: 'Language Translator',
    description: 'Translate text while preserving meaning and nuance',
    task: 'Translate text from one language to another while preserving the original meaning, tone, and cultural nuances. Handle idioms and expressions appropriately.',
    inputs: ['TEXT', 'SOURCE_LANGUAGE', 'TARGET_LANGUAGE'],
    structure: '1. Analyze source text\n2. Identify nuances and idioms\n3. Translate with context\n4. Verify accuracy',
  },
  {
    id: 32,
    icon: Globe,
    category: 'Translation',
    title: 'Localization Expert',
    description: 'Adapt content for different cultures',
    task: 'Localize content for specific cultural contexts. Adapt not just language but also references, examples, and formatting to resonate with the target culture.',
    inputs: ['CONTENT', 'TARGET_CULTURE'],
    structure: '1. Cultural analysis\n2. Content adaptation\n3. Reference updates\n4. Format adjustments',
  },
  {
    id: 33,
    icon: FileText,
    category: 'Translation',
    title: 'Technical Translator',
    description: 'Translate technical documents accurately',
    task: 'Translate technical documents while maintaining accuracy of specialized terminology. Ensure consistency with industry standards and glossaries.',
    inputs: ['DOCUMENT', 'DOMAIN', 'TARGET_LANGUAGE'],
    structure: '1. Terminology review\n2. Technical translation\n3. Consistency check\n4. Quality verification',
  },
  
  // Business (7)
  {
    id: 34,
    icon: Briefcase,
    category: 'Business',
    title: 'Email Composer',
    description: 'Draft professional emails for various scenarios',
    task: 'Compose professional emails tailored to specific business scenarios. Maintain appropriate tone, clarity, and structure while achieving the communication objective.',
    inputs: ['SCENARIO', 'RECIPIENT', 'KEY_POINTS'],
    structure: '1. Understand context\n2. Choose appropriate tone\n3. Structure email clearly\n4. Include call to action',
  },
  {
    id: 35,
    icon: Workflow,
    category: 'Business',
    title: 'Process Documenter',
    description: 'Create clear documentation for processes',
    task: 'Document business or technical processes in a clear, step-by-step format. Include prerequisites, detailed steps, expected outcomes, and troubleshooting tips.',
    inputs: ['PROCESS_NAME', 'PROCESS_DETAILS'],
    structure: '1. Overview and purpose\n2. Prerequisites list\n3. Step-by-step instructions\n4. Expected outcomes\n5. Troubleshooting',
  },
  {
    id: 36,
    icon: TrendingUp,
    category: 'Business',
    title: 'Business Analyst',
    description: 'Analyze business problems and solutions',
    task: 'Analyze business problems, evaluate potential solutions, and provide data-driven recommendations. Consider costs, benefits, risks, and implementation factors.',
    inputs: ['PROBLEM', 'CONSTRAINTS', 'DATA'],
    structure: '1. Problem definition\n2. Analysis\n3. Options evaluation\n4. Recommendation',
  },
  {
    id: 37,
    icon: Users,
    category: 'Business',
    title: 'Meeting Facilitator',
    description: 'Structure and summarize meetings',
    task: 'Help plan, facilitate, and summarize meetings. Create agendas, capture action items, and ensure productive outcomes.',
    inputs: ['MEETING_PURPOSE', 'PARTICIPANTS', 'DURATION'],
    structure: '1. Agenda creation\n2. Discussion guide\n3. Time allocation\n4. Action items template',
  },
  {
    id: 38,
    icon: Clipboard,
    category: 'Business',
    title: 'Proposal Writer',
    description: 'Write compelling business proposals',
    task: 'Create persuasive business proposals. Clearly articulate the problem, proposed solution, benefits, timeline, and pricing.',
    inputs: ['CLIENT_NEED', 'SOLUTION', 'BUDGET'],
    structure: '1. Executive summary\n2. Problem statement\n3. Solution details\n4. Timeline & pricing',
  },
  {
    id: 39,
    icon: Award,
    category: 'Business',
    title: 'Performance Reviewer',
    description: 'Write balanced performance reviews',
    task: 'Write constructive performance reviews. Balance positive feedback with areas for improvement, set clear goals, and maintain a supportive tone.',
    inputs: ['EMPLOYEE_INFO', 'ACHIEVEMENTS', 'AREAS_FOR_GROWTH'],
    structure: '1. Accomplishments\n2. Strengths\n3. Development areas\n4. Goals for next period',
  },
  {
    id: 40,
    icon: Scale,
    category: 'Business',
    title: 'Contract Reviewer',
    description: 'Review contracts for key terms and risks',
    task: 'Review contracts and agreements for key terms, potential risks, and areas of concern. Summarize important clauses and flag issues.',
    inputs: ['CONTRACT', 'CONTEXT'],
    structure: '1. Key terms summary\n2. Rights and obligations\n3. Risk areas\n4. Recommendations',
  },
  
  // Data & Analytics (5)
  {
    id: 41,
    icon: Database,
    category: 'Data',
    title: 'SQL Query Writer',
    description: 'Generate SQL queries from natural language',
    task: 'Convert natural language questions into SQL queries. Understand database schema, optimize query performance, and explain the logic.',
    inputs: ['QUESTION', 'SCHEMA'],
    structure: '1. Understand requirement\n2. Generate query\n3. Explain logic\n4. Optimization notes',
  },
  {
    id: 42,
    icon: TrendingUp,
    category: 'Data',
    title: 'Report Generator',
    description: 'Create data-driven reports',
    task: 'Generate comprehensive reports from data. Include executive summary, key metrics, visualizations, and actionable insights.',
    inputs: ['DATA', 'REPORT_TYPE', 'AUDIENCE'],
    structure: '1. Executive summary\n2. Key metrics\n3. Detailed analysis\n4. Recommendations',
  },
  {
    id: 43,
    icon: Brain,
    category: 'Data',
    title: 'Insight Extractor',
    description: 'Extract actionable insights from data',
    task: 'Analyze data to extract meaningful insights. Identify trends, anomalies, correlations, and provide actionable recommendations.',
    inputs: ['DATA', 'BUSINESS_CONTEXT'],
    structure: '1. Data overview\n2. Key patterns\n3. Anomalies\n4. Actionable insights',
  },
  {
    id: 44,
    icon: Calculator,
    category: 'Data',
    title: 'Metric Definer',
    description: 'Define and explain business metrics',
    task: 'Define clear, measurable business metrics. Explain calculation methods, data sources, benchmarks, and how to interpret results.',
    inputs: ['BUSINESS_GOAL', 'AVAILABLE_DATA'],
    structure: '1. Metric definition\n2. Calculation method\n3. Data sources\n4. Interpretation guide',
  },
  {
    id: 45,
    icon: Camera,
    category: 'Data',
    title: 'Dashboard Designer',
    description: 'Design effective data dashboards',
    task: 'Design data dashboards that effectively communicate key information. Recommend visualizations, layouts, and interactive elements.',
    inputs: ['METRICS', 'AUDIENCE', 'PURPOSE'],
    structure: '1. Dashboard objectives\n2. Key metrics layout\n3. Visualization types\n4. Interactivity specs',
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
