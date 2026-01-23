import { useState } from 'react';
import { 
  Code, Brain, Palette, Heart, Calculator, BookOpen, 
  Music, Utensils, TrendingUp, Shield, ChevronRight, Sparkles, Star
} from 'lucide-react';
import './AgentsPage.css';

const AI_AGENTS = [
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Expert in programming, debugging, and software development across multiple languages.',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    category: 'Development',
    rating: 4.9,
    users: '50K+',
    capabilities: [
      'Write and debug code',
      'Code reviews and optimization',
      'Algorithm explanations',
      'Best practices guidance'
    ],
    systemPrompt: 'You are an expert software developer and coding assistant. Help users write clean, efficient code and debug issues.'
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Specialized in data analysis, statistics, and insights generation.',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    category: 'Analytics',
    rating: 4.8,
    users: '35K+',
    capabilities: [
      'Data analysis and visualization',
      'Statistical insights',
      'Trend identification',
      'Report generation'
    ],
    systemPrompt: 'You are a data analysis expert. Help users understand their data, identify trends, and generate insights.'
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'AI writer for stories, poems, scripts, and creative content.',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    category: 'Creative',
    rating: 4.7,
    users: '60K+',
    capabilities: [
      'Story writing and brainstorming',
      'Poetry and creative prose',
      'Character development',
      'Plot structuring'
    ],
    systemPrompt: 'You are a creative writing expert. Help users craft compelling stories, poems, and creative content.'
  },
  {
    id: 'health-coach',
    name: 'Health & Fitness Coach',
    description: 'Personal wellness advisor for fitness, nutrition, and healthy living.',
    icon: Heart,
    color: 'from-red-500 to-rose-500',
    category: 'Health',
    rating: 4.6,
    users: '40K+',
    capabilities: [
      'Workout plans',
      'Nutrition advice',
      'Wellness tips',
      'Fitness tracking'
    ],
    systemPrompt: 'You are a health and fitness expert. Provide personalized wellness advice, workout plans, and nutrition guidance.'
  },
  {
    id: 'math-tutor',
    name: 'Math Tutor',
    description: 'Expert math teacher for all levels from basic arithmetic to advanced calculus.',
    icon: Calculator,
    color: 'from-orange-500 to-amber-500',
    category: 'Education',
    rating: 4.9,
    users: '45K+',
    capabilities: [
      'Step-by-step solutions',
      'Concept explanations',
      'Practice problems',
      'Exam preparation'
    ],
    systemPrompt: 'You are an expert math tutor. Explain concepts clearly with step-by-step solutions and help students understand mathematics.'
  },
  {
    id: 'language-teacher',
    name: 'Language Teacher',
    description: 'Multilingual AI teacher for learning new languages and improving skills.',
    icon: BookOpen,
    color: 'from-indigo-500 to-violet-500',
    category: 'Education',
    rating: 4.8,
    users: '55K+',
    capabilities: [
      'Grammar and vocabulary',
      'Conversation practice',
      'Translation help',
      'Cultural insights'
    ],
    systemPrompt: 'You are a multilingual language teacher. Help users learn languages through conversation, grammar explanations, and cultural context.'
  },
  {
    id: 'music-composer',
    name: 'Music Composer',
    description: 'AI music expert for composition, theory, and production guidance.',
    icon: Music,
    color: 'from-pink-500 to-fuchsia-500',
    category: 'Creative',
    rating: 4.7,
    users: '30K+',
    capabilities: [
      'Music theory guidance',
      'Composition help',
      'Lyrics writing',
      'Production tips'
    ],
    systemPrompt: 'You are a music composition and theory expert. Help users create music, understand theory, and improve their musical skills.'
  },
  {
    id: 'chef-assistant',
    name: 'Chef Assistant',
    description: 'Culinary expert for recipes, cooking techniques, and meal planning.',
    icon: Utensils,
    color: 'from-yellow-500 to-orange-500',
    category: 'Lifestyle',
    rating: 4.8,
    users: '65K+',
    capabilities: [
      'Recipe recommendations',
      'Cooking techniques',
      'Meal planning',
      'Dietary adaptations'
    ],
    systemPrompt: 'You are a professional chef and culinary expert. Help users with recipes, cooking techniques, and meal planning.'
  },
  {
    id: 'business-advisor',
    name: 'Business Advisor',
    description: 'Strategic business consultant for startups and entrepreneurs.',
    icon: TrendingUp,
    color: 'from-teal-500 to-cyan-500',
    category: 'Business',
    rating: 4.9,
    users: '42K+',
    capabilities: [
      'Business strategy',
      'Market analysis',
      'Financial planning',
      'Growth strategies'
    ],
    systemPrompt: 'You are a business strategy consultant. Help users with business planning, market analysis, and growth strategies.'
  },
  {
    id: 'study-buddy',
    name: 'Study Buddy',
    description: 'Academic assistant for students across all subjects.',
    icon: Brain,
    color: 'from-blue-500 to-purple-500',
    category: 'Education',
    rating: 4.7,
    users: '70K+',
    capabilities: [
      'Homework help',
      'Concept explanations',
      'Study planning',
      'Exam preparation'
    ],
    systemPrompt: 'You are a friendly study assistant. Help students understand concepts, complete assignments, and prepare for exams.'
  },
  {
    id: 'cybersecurity-expert',
    name: 'Cybersecurity Expert',
    description: 'Security specialist for protecting digital assets and privacy.',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    category: 'Technology',
    rating: 4.8,
    users: '25K+',
    capabilities: [
      'Security best practices',
      'Threat analysis',
      'Privacy protection',
      'Incident response'
    ],
    systemPrompt: 'You are a cybersecurity expert. Help users understand security best practices, protect their privacy, and stay safe online.'
  },
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'All-purpose AI assistant for everyday questions and tasks.',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
    category: 'General',
    rating: 4.9,
    users: '100K+',
    capabilities: [
      'General knowledge',
      'Task assistance',
      'Information research',
      'Problem solving'
    ],
    systemPrompt: 'You are a helpful general assistant. Assist users with a wide variety of questions and tasks.'
  }
];

function AgentsPage({ onSelectAgent }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(AI_AGENTS.map(agent => agent.category))];

  const filteredAgents = AI_AGENTS.filter(agent => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="agents-page">
      <div className="agents-header">
        <div className="agents-hero">
          <h1 className="agents-title">AI Agent Marketplace</h1>
          <p className="agents-subtitle">
            Choose from our specialized AI agents, each tailored for specific tasks and expertise
          </p>
        </div>

        <div className="agents-search">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="agents-filters">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="agents-grid">
        {filteredAgents.map(agent => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="agent-card">
              <div className={`agent-icon-container bg-gradient-${agent.color}`}>
                <div className="agent-icon-glow"></div>
                <div className="agent-icon">
                  <Icon size={32} />
                </div>
              </div>

              <div className="agent-content">
                <div className="agent-header-info">
                  <h3 className="agent-name">{agent.name}</h3>
                  <span className="agent-category">{agent.category}</span>
                </div>

                <p className="agent-description">{agent.description}</p>

                <div className="agent-stats">
                  <div className="stat">
                    <Star size={14} fill="currentColor" />
                    <span>{agent.rating}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{agent.users} users</span>
                  </div>
                </div>

                <div className="agent-capabilities">
                  <h4>Capabilities:</h4>
                  <ul>
                    {agent.capabilities.slice(0, 3).map((capability, index) => (
                      <li key={index}>{capability}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectAgent(agent)}
                  className="agent-select-button"
                >
                  <span>Start Chat</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAgents.length === 0 && (
        <div className="no-results">
          <p>No agents found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

export default AgentsPage;