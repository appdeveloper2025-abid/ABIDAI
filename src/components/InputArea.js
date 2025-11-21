import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react';
import '../styles/InputArea.css';

const InputArea = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleRecording = () => {
    if (!isRecording) {
      // Start recording simulation
      setIsRecording(true);
      // In a real app, you would integrate with Web Speech API here
    } else {
      // Stop recording
      setIsRecording(false);
      // Simulate speech-to-text result
      setTimeout(() => {
        setInput(prev => prev + ' This is a simulated voice input. ');
      }, 500);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file processing
      setInput(prev => prev + ` [Attached: ${file.name}] `);
    }
    // Reset file input
    e.target.value = '';
  };

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="input-area-container">
      <div className="input-area glass">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-actions">
            <label className="file-upload-btn" aria-label="Attach file">
              <Paperclip size={18} />
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx,.jpg,.png"
                style={{ display: 'none' }}
              />
            </label>
            
            <button
              type="button"
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleRecording}
              aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
            </button>
          </div>

          <div className="textarea-container">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message ABIDGPT..."
              disabled={disabled}
              rows="1"
              className="message-input"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="send-btn"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>

        <div className="input-footer">
          <div className="features-info">
            <span className="feature-tag">ABIDGPT</span>
            <span className="feature-tag">Markdown</span>
            <span className="feature-tag">Code</span>
          </div>
          <div className="shortcut-hint">
            Press ⏎ to send, Shift+⏎ for new line
          </div>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-pulse"></div>
          <span>Recording... Click to stop</span>
        </div>
      )}
    </div>
  );
};

export default InputArea;