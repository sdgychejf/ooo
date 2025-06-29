"use client";

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/useToast';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  currentMessage: string;
  isStreaming: boolean;
  error?: string;
}

export function ChatInterface({
  onSendMessage,
  messages,
  currentMessage,
  isStreaming,
  error,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showError } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="space-y-3">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg rounded-br-none max-w-[80%]">
                <p className="whitespace-pre-wrap">{message.question}</p>
              </div>
            </div>
            
            {/* AI Response */}
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none max-w-[80%]">
                <p className="whitespace-pre-wrap">{message.response}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Current Streaming Message */}
        {isStreaming && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg rounded-br-none max-w-[80%]">
                <p className="whitespace-pre-wrap">{messages[messages.length]?.question || inputValue}</p>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none max-w-[80%]">
                <p className="whitespace-pre-wrap">
                  {currentMessage}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题..."
            disabled={isStreaming}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isStreaming ? '发送中...' : '发送'}
          </button>
        </form>
      </div>
    </div>
  );
}