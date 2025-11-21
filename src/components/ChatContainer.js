import React, { forwardRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import '../styles/ChatContainer.css';

const ChatContainer = forwardRef(({ messages, isLoading }, ref) => {
  return (
    <div className="chat-container" ref={ref}>
      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">🤖</div>
            <h2>Welcome to ABIDGPT</h2>
            <p>Your intelligent AI assistant powered by advanced language models</p>
            <div className="suggestions">
              <div className="suggestion-grid">
                <div className="suggestion-card">
                  <div className="suggestion-icon">💡</div>
                  <div className="suggestion-content">
                    <h4>Creative Ideas</h4>
                    <p>Brainstorm innovative solutions</p>
                  </div>
                </div>
                <div className="suggestion-card">
                  <div className="suggestion-icon">📝</div>
                  <div className="suggestion-content">
                    <h4>Content Writing</h4>
                    <p>Write emails, articles, and more</p>
                  </div>
                </div>
                <div className="suggestion-card">
                  <div className="suggestion-icon">🔍</div>
                  <div className="suggestion-content">
                    <h4>Research Help</h4>
                    <p>Get information on various topics</p>
                  </div>
                </div>
                <div className="suggestion-card">
                  <div className="suggestion-icon">💻</div>
                  <div className="suggestion-content">
                    <h4>Code Assistance</h4>
                    <p>Help with programming tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;