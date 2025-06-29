export interface ChatMessage {
  question: string;
  response: string;
}

export interface KnowledgeBaseChatRequest {
  question: string;
  kbIds: string[];
  prompt?: string;
  history?: ChatMessage[];
  model: string;
  maxToken: string;
  hybridSearch: string;
  networking: string;
  sourceNeeded: string;
}

export interface AgentChatRequest {
  uuid: string;
  question: string;
  sourceNeeded: string;
  history?: ChatMessage[];
}

export interface StreamResponse {
  eventType: string;
  data: {
    response?: string;
    source?: any[];
    finish?: boolean;
  };
}

export interface ChatState {
  messages: ChatMessage[];
  currentMessage: string;
  isStreaming: boolean;
  error?: string;
}