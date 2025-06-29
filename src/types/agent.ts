export interface Agent {
  uuid?: string;
  botName: string;
  botDescription: string;
  model: string;
  maxToken: string;
  hybridSearch: string;
  networking: string;
  needSource: string;
  botPromptSetting?: string;
  welcomeMessage?: string;
  kbIds?: string[];
}

export interface CreateAgentRequest {
  kbIds: string[];
  botName: string;
  botDescription: string;
  model: string;
  maxToken: string;
  hybridSearch: string;
  networking: string;
  needSource: string;
  botPromptSetting?: string;
  welcomeMessage?: string;
}

export interface UpdateAgentRequest {
  uuid: string;
  botName: string;
  botDescription: string;
  model: string;
  maxToken: string;
  hybridSearch: string;
  networking: string;
  needSource: string;
  botPromptSetting?: string;
  welcomeMessage?: string;
}

export interface DeleteAgentRequest {
  uuid: string;
}

export interface BindKbsRequest {
  uuid: string;
  kbIds: string[];
}

export interface UnbindKbsRequest {
  uuid: string;
  kbIds: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}