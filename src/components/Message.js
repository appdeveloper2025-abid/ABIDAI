import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Copy, Check, User, Bot } from 'lucide-react';
import '../styles/Message.css';

const Message = ({ message, isLatest }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'} ${isLatest ? 'latest' : ''}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="avatar user-avatar">
            <User size={16} />
          </div>
        ) : (
          <div className="avatar assistant-avatar">
            <Bot size={16} />
          </div>
        )}
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {isUser ? 'You' : 'ABIDGPT'}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
        <div className="message-text">
          {isUser ? (
            <div className="user-text">
              {message.content}
            </div>
          ) : (
            <div className="assistant-text">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');
                    
                    if (!inline && match) {
                      return (
                        <div className="code-block">
                          <div className="code-header">
                            <span className="code-language">{match[1]}</span>
                            <button
                              className="copy-code-btn"
                              onClick={() => copyToClipboard(code)}
                              aria-label="Copy code"
                            >
                              {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="syntax-highlighter"
                            showLineNumbers
                            {...props}
                          >
                            {code}
                          </SyntaxHighlighter>
                        </div>
                      );
                    } else if (inline) {
                      return (
                        <code className="inline-code" {...props}>
                          {children}
                        </code>
                      );
                    } else {
                      return (
                        <div className="code-block">
                          <div className="code-header">
                            <span className="code-language">code</span>
                            <button
                              className="copy-code-btn"
                              onClick={() => copyToClipboard(code)}
                              aria-label="Copy code"
                            >
                              {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language="text"
                            PreTag="div"
                            className="syntax-highlighter"
                            {...props}
                          >
                            {code}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }
                  },
                  table({ children }) {
                    return (
                      <div className="table-container">
                        <table className="markdown-table">{children}</table>
                      </div>
                    );
                  },
                  blockquote({ children }) {
                    return <blockquote className="markdown-blockquote">{children}</blockquote>;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && (
          <div className="message-actions">
            <button
              className="action-btn"
              onClick={() => copyToClipboard(message.content)}
              aria-label="Copy message"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;