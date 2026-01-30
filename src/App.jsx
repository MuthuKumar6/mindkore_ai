import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, Trash2, Loader2, Bot, User, Copy, Check,
  MessageSquare, Zap, Stars, Moon, Sun, LogOut, ArrowLeft, Users, History,
  FileDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AgentsPage from './AgentsPage';
import ChatHistory from './ChatHistory';
import './App.css';
import downloadMessageAsPDF from './functions/downloadMessageAsPDF.js';



const API_URL = import.meta.env.VITE_API_URL || 'https://mindkore-ai-backend.onrender.com';

function App() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'agents', or 'agent-chat'
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatToHistory();
    }
  }, [messages]);

  const saveChatToHistory = () => {
    const chatKey = selectedAgent ? `chat_${sessionId}_${selectedAgent.id}` : `chat_${sessionId}`;

    const chatData = {
      messages: messages,
      agentName: selectedAgent?.name || null,
      agentId: selectedAgent?.id || null,
      lastUpdated: new Date().toISOString(),
      sessionId: sessionId
    };

    try {
      localStorage.setItem(chatKey, JSON.stringify(chatData));
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  };

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

      console.log("message To send", messageToSend);


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
    console.log('Selecting agent:', agent);
    console.log('Current view before:', currentView);
    setSelectedAgent(agent);
    setCurrentView('agent-chat');
    setMessages([]);
    console.log('Current view after:', 'agent-chat');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAgent(null);
  };

  const handleGoToAgents = () => {
    setCurrentView('agents');
  };

  const handleSelectChat = (chat) => {
    setMessages(chat.messages || []);

    if (chat.agentId) {
      // If it's an agent chat, we'd need to find the agent
      // For now, just load the messages
      setCurrentView('agent-chat');
    } else {
      setCurrentView('home');
    }
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
                {selectedAgent && selectedAgent.icon ? (
                  React.createElement(selectedAgent.icon, { className: 'logo-icon', size: 28 })
                ) : (
                  <Sparkles className="logo-icon" />
                )}
              </div>
            </div>
            <div className="header-text">
              <h1 className="app-title">{selectedAgent?.name || 'MindKore AI'}</h1>
              <p className="app-subtitle">
                <Zap size={12} />
                {selectedAgent?.category || 'Powered by MindKore'}
              </p>
            </div>
          </div>

          <div className="header-actions">
            {/* <button
              onClick={() => setIsDark(!isDark)}
              className="icon-button theme-toggle"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button> */}

            <button onClick={() => setShowHistory(true)} className="clear-button">
              <History size={16} />
              <span>View History</span>
            </button>



            {messages.length > 0 && (
              <button onClick={clearChat} className="clear-button">
                <Trash2 size={16} />
                <span>Clear Chat</span>
              </button>
            )}

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

              {!selectedAgent && <div className="suggestions-grid">
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
              </div>}
              {selectedAgent && <div>
                <p style={{ color: "indigo" }}>Capabilities</p>
                <br></br>
                {selectedAgent.capabilities.map((a, i) => (
                  <li style={{ color: "gray" }} key={i}>{a}<br></br><br></br></li>
                ))}
              </div>}
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
                    {message.role === 'assistant' && (<>
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
                      <button
                        onClick={() => downloadMessageAsPDF(message.content, index)}
                        className="pdf-button"
                        title="Download as PDF"
                      >
                        <FileDown size={14} /> Download PDF
                      </button>
                    </>
                    )}

                    {/* New PDF button */}


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

                    {/* <p className="message-time">
                      <span className="time-dot"></span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p> */}
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
                      {/* <Loader2 size={18} className="loading-spinner" /> */}
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
            {/* <div className="input-container">
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
            </div> */}
            <div style={{
              position: 'relative',
              width: '100%',
              //maxWidth: '800px',
              //margin: '0 auto',
              padding: '1px'
            }}>
              {/* Glow effect layer */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: '12px',
                zIndex: 1
              }} />

              {/* Main wrapper */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                //backgroundColor: '#000000',
                border: '1px solid #8f8b8bff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(233, 229, 229, 0.5)',
                height: "60px"
              }}>
                {/* Icon */}
                <MessageSquare
                  size={20}
                  style={{
                    color: '#272323ff',
                    marginLeft: '16px',
                    flexShrink: 0
                  }}
                />

                {/* Input field */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Hi ${ user.name}...., Ask me anything...`}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    color: '#332f2fff',
                    border: 'none',
                    outline: 'none',
                    padding: '14px 12px',
                    fontSize: '16px',
                    width: '100%',
                    caretColor: '#3b82f6',
                    height: "50%"
                  }}
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  style={{
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    padding: '0 16px',
                    cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                    opacity: (!input.trim() || isLoading) ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {/* Button gradient background */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    //background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    opacity: 0.15,
                    borderRadius: '0 12px 12px 0'
                  }} />

                  <span style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'black',
                    fontWeight: 500
                  }}>
                    {isLoading ? (
                      <Loader2
                        size={20}
                        style={{
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                    ) : (
                      <Send size={20} />
                    )}
                    <span style={{ fontSize: '14px' }}>Send</span>
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

      {/* Chat History Sidebar */}
      <ChatHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectChat={handleSelectChat}
        currentSessionId={`chat_${sessionId}`}
      />
    </div>
  );
}

export default App;