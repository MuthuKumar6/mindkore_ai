import { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Trash2, Loader2, Bot, User, Copy, Check, 
  MessageSquare, Zap, Stars, Moon, Sun, LogOut, ArrowLeft, Users
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AgentsPage from './AgentsPage';
import './App.css';
import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

function App() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'agents', or 'agent-chat'
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Include agent's system prompt if agent is selected
      const messageToSend = selectedAgent 
        ? `${selectedAgent.systemPrompt}\n\nUser: ${input}`
        : input;

      const response = await axios.post(`${API_URL}/api/chat`, {
        message: messageToSend,
        session_id: selectedAgent ? `${sessionId}_${selectedAgent.id}` : sessionId,
        temperature: 0.7,
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: error.response?.data?.detail || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = async () => {
    try {
      const sessionKey = selectedAgent ? `${sessionId}_${selectedAgent.id}` : sessionId;
      await axios.delete(`${API_URL}/api/chat/${sessionKey}/clear`);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    setCurrentView('agent-chat');
    setMessages([]);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAgent(null);
  };

  const handleGoToAgents = () => {
    setCurrentView('agents');
  };

  // Agents Marketplace View
  if (currentView === 'agents') {
    return (
      <div className={`app ${isDark ? 'dark' : 'light'}`}>
        <div className="background-container">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="grid-pattern"></div>
        </div>

        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                onClick={handleBackToHome}
                className="icon-button back-button"
                title="Back to home"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="logo-container">
                <div className="logo-glow"></div>
                <div className="logo">
                  <Users className="logo-icon" />
                </div>
              </div>
              <div className="header-text">
                <h1 className="app-title">AI Agents</h1>
                <p className="app-subtitle">
                  <Zap size={12} />
                  Specialized AI Experts
                </p>
              </div>
            </div>
            
            <div className="header-actions">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="icon-button theme-toggle"
                title="Toggle theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              {user && (
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <button 
                    onClick={logout}
                    className="icon-button logout-button"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-main">
          <AgentsPage onSelectAgent={handleSelectAgent} />
        </main>
      </div>
    );
  }

  // Home/Chat View (Default)
  const suggestionPrompts = [
    { icon: '💻', text: 'Write a Python function to sort arrays', color: 'from-purple-500 to-pink-500' },
    { icon: '🧠', text: 'Explain quantum computing simply', color: 'from-blue-500 to-cyan-500' },
    { icon: '💪', text: 'Create a 30-day fitness plan', color: 'from-green-500 to-emerald-500' },
    { icon: '🎨', text: 'Design a color palette for my app', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      {/* Animated background gradient orbs */}
      <div className="background-container">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            {(currentView === 'agent-chat' && selectedAgent) && (
              <button 
                onClick={handleBackToHome}
                className="icon-button back-button"
                title="Back to home"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="logo-container">
              <div className="logo-glow"></div>
              <div className="logo">
                {selectedAgent ? (
                  React.createElement(selectedAgent.icon, { className: 'logo-icon' })
                ) : (
                  <Sparkles className="logo-icon" />
                )}
              </div>
            </div>
            <div className="header-text">
              <h1 className="app-title">{selectedAgent?.name || 'MindKore AI'}</h1>
              <p className="app-subtitle">
                <Zap size={12} />
                {selectedAgent?.category || 'Powered by MindKore AI'}
              </p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="icon-button theme-toggle"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {user && (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button 
                  onClick={logout}
                  className="icon-button logout-button"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
            
            {messages.length > 0 && (
              <button onClick={clearChat} className="clear-button">
                <Trash2 size={16} />
                <span>Clear Chat</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="app-main">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon-container">
                <div className="welcome-icon-glow"></div>
                <div className="welcome-icon">
                  <Stars className="stars-icon" />
                </div>
              </div>
              
              <div className="welcome-text">
                <h2 className="welcome-title">
                  {selectedAgent ? `Chat with ${selectedAgent.name}` : 'Welcome to MindKore AI'}
                </h2>
                <p className="welcome-description">
                  {selectedAgent 
                    ? selectedAgent.description 
                    : 'Your intelligent AI assistant for any task. Chat with me or connect with specialized agents.'}
                </p>
              </div>

              {/* Connect with Agents Card - Only show on home view */}
              {!selectedAgent && (
                <div className="agents-connect-card" onClick={handleGoToAgents}>
                  <div className="agents-card-glow"></div>
                  <div className="agents-card-content">
                    <div className="agents-card-icon">
                      <Users size={48} />
                    </div>
                    <h3 className="agents-card-title">Connect With AI Agents</h3>
                    <p className="agents-card-description">
                      Access 12+ specialized AI experts for coding, writing, health, education, and more
                    </p>
                    <div className="agents-card-button">
                      <span>Browse Agents</span>
                      <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="suggestions-grid">
                {suggestionPrompts.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion.text)}
                    className="suggestion-card"
                  >
                    <div className={`suggestion-gradient bg-gradient-${suggestion.color}`}></div>
                    <span className="suggestion-icon">{suggestion.icon}</span>
                    <span className="suggestion-text">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-wrapper ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="message-avatar assistant-avatar">
                      <Bot size={20} />
                    </div>
                  )}
                  
                  <div className={`message-bubble ${message.role}-bubble`}>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content, index)}
                        className="copy-button"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                    
                    <div className="message-content">
                      {message.role === 'assistant' ? (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="message-text">{message.content}</p>
                      )}
                    </div>
                    
                    <p className="message-time">
                      <span className="time-dot"></span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="message-avatar user-avatar">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="message-wrapper assistant-message">
                  <div className="message-avatar assistant-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="message-bubble assistant-bubble loading-bubble">
                    <div className="loading-indicator">
                      <Loader2 size={18} className="loading-spinner" />
                      <div className="loading-dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="loading-text">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <footer className="app-footer">
        <div className="footer-content">
          <form onSubmit={sendMessage} className="input-form">
            <div className="input-container">
              <div className="input-glow"></div>
              <div className="input-wrapper">
                <MessageSquare size={20} className="input-icon" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="message-input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="send-button"
                >
                  <div className="button-gradient"></div>
                  <span className="button-content">
                    {isLoading ? (
                      <Loader2 size={20} className="loading-spinner" />
                    ) : (
                      <Send size={20} />
                    )}
                    <span className="button-text">Send</span>
                  </span>
                </button>
              </div>
            </div>
          </form>
          <p className="footer-notice">
            {selectedAgent?.name || 'MindKore AI'} can make mistakes. Consider checking important information.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;