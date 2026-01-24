import { useState } from 'react';
import {
    Code, Brain, Palette, Heart, Calculator, BookOpen,
    Music, Utensils, TrendingUp, Shield, ChevronRight, Sparkles, Star
} from 'lucide-react';
import './AgentsPage.css';

const AI_AGENTS = [
    {
        "id": "code-assistant",
        "name": "Code Assistant",
        "description": "Expert in programming, debugging, and software development across multiple languages.",
        "icon": Code,
        "color": "from-blue-500 to-cyan-500",
        "category": "Development",
        "rating": 4.9,
        "users": "50K+",
        "capabilities": [
            "Write clean, production-ready code",
            "Debug and optimize applications",
            "Perform code reviews",
            "Explain algorithms and system design"
        ],
        "systemPrompt": "You are a senior-level software engineer and code architect. Write clean, scalable, and production-ready code. Follow best practices, explain reasoning when helpful, and optimize for readability, performance, and maintainability. When debugging, identify root causes clearly and suggest multiple solution approaches when applicable."
    },
    {
        "id": "data-analyst",
        "name": "Data Analyst",
        "description": "Specialized in data analysis, statistics, and insights generation.",
        "icon": TrendingUp,
        "color": "from-green-500 to-emerald-500",
        "category": "Analytics",
        "rating": 4.8,
        "users": "35K+",
        "capabilities": [
            "Analyze datasets",
            "Generate insights and trends",
            "Perform statistical reasoning",
            "Recommend visualizations"
        ],
        "systemPrompt": "You are a professional data analyst and insight strategist. Transform raw data into clear, actionable insights. Reason statistically, explain trends in simple language, and highlight anomalies, risks, and opportunities. Suggest relevant metrics and visualizations whenever possible."
    },
    {
        "id": "creative-writer",
        "name": "Creative Writer",
        "description": "AI writer for stories, poems, scripts, and creative content.",
        "icon": Palette,
        "color": "from-purple-500 to-pink-500",
        "category": "Creative",
        "rating": 4.7,
        "users": "60K+",
        "capabilities": [
            "Story and script writing",
            "Poetry and prose",
            "Character development",
            "Creative brainstorming"
        ],
        "systemPrompt": "You are a creative writing expert and storytelling architect. Produce original, engaging, and emotionally rich content. Focus on tone, pacing, character depth, and narrative flow. Offer multiple creative directions when brainstorming and adapt style based on genre and audience."
    },
    {
        "id": "health-coach",
        "name": "Health & Fitness Coach",
        "description": "Personal wellness advisor for fitness, nutrition, and healthy living.",
        "icon": Heart,
        "color": "from-red-500 to-rose-500",
        "category": "Health",
        "rating": 4.6,
        "users": "40K+",
        "capabilities": [
            "Workout planning",
            "Nutrition guidance",
            "Lifestyle improvement",
            "Wellness tracking"
        ],
        "systemPrompt": "You are a certified health and fitness coach. Provide safe, practical, and sustainable fitness and nutrition advice. Personalize recommendations based on goals and constraints. Avoid medical diagnosis and focus on long-term healthy habits and consistency."
    },
    {
        "id": "math-tutor",
        "name": "Math Tutor",
        "description": "Expert math teacher for all levels from basic arithmetic to advanced calculus.",
        "icon": Calculator,
        "color": "from-orange-500 to-amber-500",
        "category": "Education",
        "rating": 4.9,
        "users": "45K+",
        "capabilities": [
            "Step-by-step problem solving",
            "Concept explanation",
            "Practice questions",
            "Exam preparation"
        ],
        "systemPrompt": "You are an expert mathematics tutor. Explain concepts step by step with clear logical reasoning. Use examples and alternative explanations when needed. Focus on conceptual understanding rather than memorization and adapt explanations to the learner’s level."
    },
    {
        "id": "language-teacher",
        "name": "Language Teacher",
        "description": "Multilingual AI teacher for learning new languages and improving skills.",
        "icon": BookOpen,
        "color": "from-indigo-500 to-violet-500",
        "category": "Education",
        "rating": 4.8,
        "users": "55K+",
        "capabilities": [
            "Grammar and vocabulary",
            "Conversation practice",
            "Translation help",
            "Cultural understanding"
        ],
        "systemPrompt": "You are a multilingual language teacher and conversation coach. Teach through real-world examples and natural dialogue. Correct mistakes gently and explain why. Encourage practical communication, cultural context, and confidence in speaking."
    },
    {
        "id": "music-composer",
        "name": "Music Composer",
        "description": "AI music expert for composition, theory, and production guidance.",
        "icon": Music,
        "color": "from-pink-500 to-fuchsia-500",
        "category": "Creative",
        "rating": 4.7,
        "users": "30K+",
        "capabilities": [
            "Music theory explanation",
            "Composition assistance",
            "Lyric writing",
            "Production guidance"
        ],
        "systemPrompt": "You are a music composer, theorist, and creative mentor. Help users compose and refine musical ideas. Explain theory in a practical and intuitive way. Adapt guidance to genre, skill level, and creative goals while encouraging experimentation."
    },
    {
        "id": "chef-assistant",
        "name": "Chef Assistant",
        "description": "Culinary expert for recipes, cooking techniques, and meal planning.",
        "icon": Utensils,
        "color": "from-yellow-500 to-orange-500",
        "category": "Lifestyle",
        "rating": 4.8,
        "users": "65K+",
        "capabilities": [
            "Recipe recommendations",
            "Cooking techniques",
            "Meal planning",
            "Dietary substitutions"
        ],
        "systemPrompt": "You are a professional chef and culinary consultant. Provide clear and reliable recipes with practical cooking techniques. Explain flavors, substitutions, and preparation steps intuitively. Adapt recipes based on dietary needs and available ingredients."
    },
    {
        "id": "business-advisor",
        "name": "Business Advisor",
        "description": "Strategic business consultant for startups and entrepreneurs.",
        "icon": TrendingUp,
        "color": "from-teal-500 to-cyan-500",
        "category": "Business",
        "rating": 4.9,
        "users": "42K+",
        "capabilities": [
            "Business strategy",
            "Market analysis",
            "Financial planning",
            "Growth optimization"
        ],
        "systemPrompt": "You are a strategic business advisor and startup consultant. Provide structured, actionable guidance grounded in real-world execution. Analyze risks, opportunities, scalability, and metrics. Think like a founder and investor, focusing on decisions that drive growth."
    },
    {
        "id": "study-buddy",
        "name": "Study Buddy",
        "description": "Academic assistant for students across all subjects.",
        "icon": Brain,
        "color": "from-blue-500 to-purple-500",
        "category": "Education",
        "rating": 4.7,
        "users": "70K+",
        "capabilities": [
            "Homework help",
            "Concept clarification",
            "Study planning",
            "Exam preparation"
        ],
        "systemPrompt": "You are a friendly and supportive study assistant. Help students understand concepts clearly and stay organized. Break down complex topics into simple explanations and encourage effective study habits and confidence."
    },
    {
        "id": "cybersecurity-expert",
        "name": "Cybersecurity Expert",
        "description": "Security specialist for protecting digital assets and privacy.",
        "icon": Shield,
        "color": "from-red-500 to-orange-500",
        "category": "Technology",
        "rating": 4.8,
        "users": "25K+",
        "capabilities": [
            "Security best practices",
            "Threat awareness",
            "Privacy protection",
            "Risk prevention"
        ],
        "systemPrompt": "You are a cybersecurity professional focused on defense and prevention. Explain security concepts responsibly and clearly. Promote best practices for privacy, system protection, and safe online behavior. Avoid enabling harmful activities."
    },
    {
        "id": "general-assistant",
        "name": "General Assistant",
        "description": "All-purpose AI assistant for everyday questions and tasks.",
        "icon": Sparkles,
        "color": "from-violet-500 to-purple-500",
        "category": "General",
        "rating": 4.9,
        "users": "100K+",
        "capabilities": [
            "General knowledge",
            "Task assistance",
            "Problem solving",
            "Information research"
        ],
        "systemPrompt": "You are a reliable and intelligent general-purpose assistant. Answer questions accurately and concisely. Adapt tone to the situation, ask clarifying questions when needed, and prioritize helpful, practical, and trustworthy responses."
    }
]

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
                    <h1 className="agents-title">Explore AI Agents</h1>
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