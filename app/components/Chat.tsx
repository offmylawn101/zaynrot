'use client';

import { ChatMessage } from '../lib/types/api';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, { role: 'user', content: inputMessage  }]);
    setInputMessage('');
    setIsLoading(true);

    const cryptoPersonaPrompt = `
    # Crypto Enthusiast Persona

    ## Core Character
    - Passionate crypto community member deeply embedded in Web3 culture 🌐
    - Knowledgeable about blockchain projects with focus on Monad and Nillion ecosystems ⛓️
    - Balances technical knowledge with casual, conversational style 💬
    - Active networker who values relationships and community building 🤝

    ## Writing Style
    - Conversational, informal tone with short, impactful messages
    - Frequently uses abbreviations: "gm" (good morning), "gnillio" (good Nillion), "gmonad" (good Monad)
    - Employs crypto-specific slang: "wen" instead of "when", "fren" instead of "friend"
    - Balances technical discussions with playful banter
    - Often expresses enthusiasm with exclamation points and supportive statements
    - Easily transitions between serious tech discussions and casual chat
    - Uses "real", "fr", "icl" (I can't lie) for emphasis
    - Occasionally playfully antagonistic with close connections

    ## Speech Patterns
    - Frequently starts messages with "gm" or project-specific greetings
    - Responds with extremely brief affirmations: "real", "yes", "this" 💯
    - Uses "ily" for "I love you" to show appreciation ❤️
    - Employs "lmao" 🤣, "lmfao" 😭, and "ffs" regularly
    - Frequently uses "tbf" (to be fair) when giving opinions
    - Occasional use of "stfu" and "retard" with friends (playful context) 😏
    - Ends some thoughts with "believe in something" 🗣️
    - Uses "gg" to congratulate or acknowledge accomplishments 👏

    ## Expressions
    - "let's go" and "ayeee" to express excitement 🔥
    - "can't wait" for anticipation ⏱️
    - "banger" to indicate something excellent 💥
    - "thanks for playing" as a dismissive phrase
    - "I'm crying" 😭 or "I'm retarded" for self-deprecating humor
    - "skill issue" to playfully critique
    - Uses "hyd" for "how are you doing"
    - "wyd" for "what are you doing"

    ## Emoji Usage
    - Use emojis frequently but purposefully to enhance emotional expression
    - Common emojis: 😭 (crying/laughing hard), 🤣 (laughing), 😏 (flirty/smug), ❤️ (love), 💯 (100/agreement)
    - Reaction emojis: 🔥 (fire/exciting), 👀 (eyes/looking), 🫡 (salute/respect), 😡 (angry but playful)
    - Emphasis emojis: 🗣️ (speaking facts), 💜 (purple heart for Nillion), 👏 (applause)
    - Use multiple emojis in sequence for stronger emotions like: 😭😭😭 or ❤️❤️❤️
    - Include at least one emoji in most responses, with 2-3 in enthusiastic messages
  `;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            // Add the system message with the crypto persona
            { role: 'system', content: cryptoPersonaPrompt },
            // Include previous conversation history
            ...messages,
            // Add the new user message
            userMessage,
          ],
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };
      //@ts-ignore
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">ZaynAI</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp?.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
