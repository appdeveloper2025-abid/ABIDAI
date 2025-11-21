import React from 'react';
import { Bot } from 'lucide-react';
import '../styles/TypingIndicator.css';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        <div className="avatar assistant-avatar">
          <Bot size={16} />
        </div>
      </div>
      
      <div className="typing-content">
        <div className="typing-header">
          <span className="typing-sender">ABIDGPT</span>
          <span className="typing-status">is typing</span>
        </div>
        
        <div className="typing-bubble">
          <div className="typing-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="typing-text">Thinking...</div>
        </div>
        
        <div className="ai-thinking">
          <div className="thinking-animation">
            <div className="thinking-orb"></div>
            <div className="thinking-orb"></div>
            <div className="thinking-orb"></div>
          </div>
          <span className="thinking-text">Processing your request</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;