import React from 'react';
import { Menu, Plus, Zap, Settings, Wifi, WifiOff, Loader } from 'lucide-react';
import '../styles/Header.css';

const Header = ({ onMenuClick, onNewChat, apiStatus = 'checking' }) => {
  const getApiStatusIcon = () => {
    switch (apiStatus) {
      case 'healthy':
        return <Wifi size={14} />;
      case 'error':
      case 'invalid':
        return <WifiOff size={14} />;
      default:
        return <Loader size={14} className="spin" />;
    }
  };

  const getApiStatusText = () => {
    switch (apiStatus) {
      case 'healthy':
        return 'Connected';
      case 'error':
        return 'API Error';
      case 'invalid':
        return 'No API Key';
      default:
        return 'Connecting...';
    }
  };

  return (
    <header className="header glass">
      <div className="header-left">
        <button 
          className="icon-btn" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="logo">
          <Zap className="logo-icon" size={24} />
          <span className="logo-text">ABIDGPT</span>
        </div>
      </div>

      <div className="header-center">
        <div className="ai-status">
          <div className="status-indicator"></div>
          <span className="status-text">AI Assistant Ready</span>
        </div>
      </div>

      <div className="header-right">
        <div className={`api-status ${apiStatus}`}>
          {getApiStatusIcon()}
          <span>{getApiStatusText()}</span>
        </div>
        
        <button 
          className="new-chat-btn"
          onClick={onNewChat}
          aria-label="New chat"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>
        
        <button 
          className="icon-btn"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;