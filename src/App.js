import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import InputArea from './components/InputArea';
import { useLocalStorage } from './hooks/useLocalStorage';
import openAIApi, { isApiConfigured } from './utils/api';
import './App.css';

function App() {
  const [chats, setChats] = useLocalStorage('abidgpt-chats', [
    {
      id: '1',
      title: 'Welcome to ABIDGPT',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m ABIDGPT, your AI assistant powered by OpenAI. How can I help you today?',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    }
  ]);
  
  const [activeChat, setActiveChat] = useState('1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const chatContainerRef = useRef(null);

  const currentChat = chats.find(chat => chat.id === activeChat);

  // Check API configuration on component mount
  useEffect(() => {
    const checkApi = async () => {
      if (!isApiConfigured()) {
        setApiStatus('invalid');
        return;
      }

      try {
        setApiStatus('checking');
        const health = await openAIApi.checkHealth();
        setApiStatus(health.healthy ? 'healthy' : 'error');
        
        if (!health.healthy) {
          console.error('API Health Check Failed:', health.message);
        }
      } catch (error) {
        setApiStatus('error');
        console.error('API Configuration Error:', error);
      }
    };

    checkApi();
  }, []);

  const addMessage = (role, content) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === activeChat 
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: Date.now().toString(),
                  role,
                  content,
                  timestamp: new Date().toISOString()
                }
              ],
              // Update chat title if it's the first user message
              title: chat.title === 'New Chat' && role === 'user' 
                ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                : chat.title
            }
          : chat
      )
    );
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // Add user message
    addMessage('user', content);
    setIsLoading(true);

    try {
      // Prepare messages for OpenAI API
      const messagesForAPI = currentChat.messages
        .filter(msg => msg.role !== 'system') // Filter out system messages if any
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Add the new user message
      messagesForAPI.push({
        role: 'user',
        content: content.trim()
      });

      // Call OpenAI API
      const response = await openAIApi.chat(messagesForAPI);

      // Add assistant response
      addMessage('assistant', response.content);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show appropriate error message to user
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error.message.includes('API key')) {
        errorMessage = 'API key configuration error. Please check your OpenAI API key.';
      } else if (error.message.includes('Rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('OpenAI server error')) {
        errorMessage = 'OpenAI servers are experiencing issues. Please try again later.';
      }
      
      addMessage('assistant', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setIsSidebarOpen(false);
  };

  const deleteChat = (chatId) => {
    if (chats.length === 1) {
      // Don't delete the last chat
      return;
    }
    
    setChats(prevChats => {
      const filtered = prevChats.filter(chat => chat.id !== chatId);
      if (activeChat === chatId) {
        setActiveChat(filtered[0]?.id || '1');
      }
      return filtered;
    });
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat?.messages, isLoading]);

  // Show API status in console for debugging
  useEffect(() => {
    if (apiStatus === 'invalid') {
      console.error('❌ OpenAI API key not configured properly');
      console.log('Please check your .env file and ensure REACT_APP_OPENAI_API_KEY is set');
    } else if (apiStatus === 'error') {
      console.error('❌ OpenAI API connection failed');
    } else if (apiStatus === 'healthy') {
      console.log('✅ OpenAI API connected successfully');
    }
  }, [apiStatus]);

  return (
    <div className="app">
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={createNewChat}
        apiStatus={apiStatus}
      />
      
      <div className="app-body">
        <Sidebar
          chats={chats}
          activeChat={activeChat}
          onChatSelect={setActiveChat}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <div className="main-content">
          <ChatContainer
            ref={chatContainerRef}
            messages={currentChat?.messages || []}
            isLoading={isLoading}
            apiStatus={apiStatus}
          />
          
          <InputArea
            onSendMessage={sendMessage}
            disabled={isLoading || apiStatus !== 'healthy'}
          />

          {/* API Status Warning */}
          {apiStatus === 'invalid' && (
            <div className="api-warning">
              <div className="warning-content">
                <strong>API Configuration Required</strong>
                <p>Please check your OpenAI API key in the .env file</p>
              </div>
            </div>
          )}
          
          {apiStatus === 'error' && (
            <div className="api-warning error">
              <div className="warning-content">
                <strong>API Connection Error</strong>
                <p>Unable to connect to OpenAI. Please check your API key and internet connection.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;