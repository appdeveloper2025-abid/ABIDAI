const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.REACT_APP_DEFAULT_MODEL || 'gpt-3.5-turbo';
const MAX_TOKENS = parseInt(process.env.REACT_APP_MAX_TOKENS) || 2000;
const TEMPERATURE = parseFloat(process.env.REACT_APP_TEMPERATURE) || 0.7;

class OpenAIAPI {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.baseURL = OPENAI_API_URL;
  }

  async chat(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured. Please check your environment variables.');
    }

    const {
      model = DEFAULT_MODEL,
      max_tokens = MAX_TOKENS,
      temperature = TEMPERATURE,
      stream = false
    } = options;

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens,
          temperature,
          stream: false, // Set to false for simplicity, can implement streaming later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API');
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        finish_reason: data.choices[0].finish_reason,
      };
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      
      // Enhanced error handling with specific messages
      if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('500')) {
        throw new Error('OpenAI server error. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  // Method to format conversation history for API
  formatConversation(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  // Method to validate API key format
  validateApiKey() {
    if (!this.apiKey) {
      return { valid: false, message: 'API key is missing' };
    }
    
    if (!this.apiKey.startsWith('sk-')) {
      return { valid: false, message: 'Invalid API key format' };
    }
    
    return { valid: true, message: 'API key appears valid' };
  }

  // Method to get available models (for future use)
  async getModels() {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data.filter(model => 
        model.id.includes('gpt') && !model.id.includes('instruct')
      );
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  // Method to check API health
  async checkHealth() {
    try {
      const testMessage = [
        {
          role: 'user',
          content: 'Hello, are you working? Respond with just "OK" if you are.'
        }
      ];

      const response = await this.chat(testMessage, { max_tokens: 10 });
      return { 
        healthy: true, 
        message: 'API is working correctly',
        response: response.content 
      };
    } catch (error) {
      return { 
        healthy: false, 
        message: error.message,
        error: error 
      };
    }
  }

  // Method for streaming responses (for future implementation)
  async *chatStream(messages, options = {}) {
    const {
      model = DEFAULT_MODEL,
      max_tokens = MAX_TOKENS,
      temperature = TEMPERATURE,
    } = options;

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens,
          temperature,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ') && !line.includes('[DONE]')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.choices[0].delta.content) {
                  yield data.choices[0].delta.content;
                }
              } catch (e) {
                // Ignore JSON parsing errors for incomplete chunks
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Streaming chat failed:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const openAIApi = new OpenAIAPI();

export default openAIApi;

// Utility function for quick chat
export const sendMessage = async (message, conversationHistory = []) => {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  return await openAIApi.chat(messages);
};

// Utility function to check if API is configured
export const isApiConfigured = () => {
  return !!OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-');
};

// Export constants for use in other components
export {
  OPENAI_API_KEY,
  DEFAULT_MODEL,
  MAX_TOKENS,
  TEMPERATURE
};