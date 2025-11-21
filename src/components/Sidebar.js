import React from 'react';
import { X, MessageCircle, Trash2, Clock } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ 
  chats, 
  activeChat, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat, 
  isOpen, 
  onClose 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getChatTitle = (chat) => {
    if (chat.title && chat.title !== 'New Chat') {
      return chat.title;
    }
    
    const firstUserMessage = chat.messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 30) + 
             (firstUserMessage.content.length > 30 ? '...' : '');
    }
    
    return 'New Chat';
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <MessageCircle size={20} />
            <span>Chat History</span>
          </div>
          <button 
            className="icon-btn close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          <button 
            className="new-chat-sidebar-btn"
            onClick={onNewChat}
          >
            <span>+ New Chat</span>
          </button>

          <div className="chats-list">
            {chats.length === 0 ? (
              <div className="empty-state">
                <MessageCircle size={48} />
                <p>No chats yet</p>
                <span>Start a conversation to see it here</span>
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                  onClick={() => onChatSelect(chat.id)}
                >
                  <div className="chat-item-content">
                    <div className="chat-title">
                      {getChatTitle(chat)}
                    </div>
                    <div className="chat-meta">
                      <Clock size={12} />
                      <span>{formatDate(chat.createdAt)}</span>
                      <span className="message-count">
                        {chat.messages.length} messages
                      </span>
                    </div>
                  </div>
                  
                  {chats.length > 1 && (
                    <button
                      className="delete-chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      aria-label="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="app-info">
            <div className="app-version">ABIDGPT v1.0</div>
            <div className="app-status">AI Assistant</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;