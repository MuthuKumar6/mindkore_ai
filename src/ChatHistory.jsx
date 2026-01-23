import { useState, useEffect } from 'react';
import { History, Trash2, MessageSquare, X, Calendar } from 'lucide-react';
import './ChatHistory.css';

function ChatHistory({ isOpen, onClose, onSelectChat, currentSessionId }) {
  const [chatHistories, setChatHistories] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    // Load chat histories from localStorage
    loadChatHistories();
  }, []);

  const loadChatHistories = () => {
    const histories = [];
    
    // Get all keys from localStorage that start with 'chat_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_')) {
        try {
          const chatData = JSON.parse(localStorage.getItem(key));
          histories.push({
            id: key,
            ...chatData
          });
        } catch (e) {
          console.error('Error parsing chat history:', e);
        }
      }
    }

    // Sort by last updated (most recent first)
    histories.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    
    setChatHistories(histories);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this chat?')) {
      localStorage.removeItem(chatId);
      loadChatHistories();
    }
  };

  const deleteAllChats = () => {
    if (confirm('Are you sure you want to delete all chat history?')) {
      const keysToDelete = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('chat_')) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
      loadChatHistories();
    }
  };

  const filterChats = (chats) => {
    const now = new Date();
    
    return chats.filter(chat => {
      const chatDate = new Date(chat.lastUpdated);
      
      switch (selectedFilter) {
        case 'today':
          return chatDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return chatDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return chatDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getPreviewText = (messages) => {
    if (!messages || messages.length === 0) return 'No messages';
    
    const lastMessage = messages[messages.length - 1];
    const text = lastMessage.content || '';
    return text.length > 60 ? text.substring(0, 60) + '...' : text;
  };

  const filteredChats = filterChats(chatHistories);

  if (!isOpen) return null;

  return (
    <div className="chat-history-overlay" onClick={onClose}>
      <div className="chat-history-sidebar" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="history-header">
          <div className="history-title">
            <History size={24} />
            <h2>Chat History</h2>
          </div>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="history-filters">
          <button
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'today' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('today')}
          >
            Today
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('week')}
          >
            Week
          </button>
          <button
            className={`filter-btn ${selectedFilter === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('month')}
          >
            Month
          </button>
        </div>

        {/* Delete All Button */}
        {chatHistories.length > 0 && (
          <div className="delete-all-container">
            <button onClick={deleteAllChats} className="delete-all-btn">
              <Trash2 size={16} />
              Clear All History
            </button>
          </div>
        )}

        {/* Chat List */}
        <div className="history-list">
          {filteredChats.length === 0 ? (
            <div className="empty-history">
              <MessageSquare size={48} />
              <p>No chat history</p>
              <span>Your conversations will appear here</span>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`history-item ${chat.id === currentSessionId ? 'active' : ''}`}
                onClick={() => {
                  onSelectChat(chat);
                  onClose();
                }}
              >
                <div className="history-item-header">
                  <div className="history-item-icon">
                    <MessageSquare size={18} />
                  </div>
                  <div className="history-item-content">
                    <h3 className="history-item-title">
                      {chat.agentName || 'General Chat'}
                    </h3>
                    <p className="history-item-preview">
                      {getPreviewText(chat.messages)}
                    </p>
                  </div>
                </div>
                <div className="history-item-footer">
                  <div className="history-item-meta">
                    <Calendar size={12} />
                    <span>{formatDate(chat.lastUpdated)}</span>
                    <span className="message-count">
                      {chat.messages?.length || 0} messages
                    </span>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="delete-chat-btn"
                    title="Delete chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;