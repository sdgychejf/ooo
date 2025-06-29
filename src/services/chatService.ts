import {
  KnowledgeBaseChatRequest,
  AgentChatRequest,
  StreamResponse,
} from '@/types/chat';

const BASE_URL = 'https://openapi.youdao.com/q_anything/api';

class ChatService {
  private apikey: string = '';

  setApiKey(apikey: string) {
    this.apikey = apikey;
  }

  async streamKnowledgeBaseChat(
    request: KnowledgeBaseChatRequest,
    onMessage: (response: StreamResponse) => void,
    onError: (error: string) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      console.log('发送知识库聊天请求:', request);
      const response = await fetch(`${BASE_URL}/chat_stream`, {
        method: 'POST',
        headers: {
          'Authorization': this.apikey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('收到响应状态:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('错误响应内容:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // 处理最后可能剩余的数据
          if (buffer.trim()) {
            const lines = buffer.split('\n');
            for (const line of lines) {
              if (line.trim() === '') continue;
              
              if (line.startsWith('data:')) {
                try {
                  const jsonStr = line.slice(5);
                  console.log('解析数据行:', jsonStr);
                  const data = JSON.parse(jsonStr);
                  console.log('解析后的数据:', data);
                  if (data.result && data.result.response) {
                    onMessage({
                      eventType: 'message',
                      data: {
                        response: data.result.response
                      }
                    });
                  }
                } catch (e) {
                  console.warn('解析流数据失败:', line, e);
                }
              }
            }
          }
          console.log('流式响应完成');
          onComplete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('收到数据块:', chunk);
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('data:')) {
            try {
              const jsonStr = line.slice(5);
              console.log('解析数据行:', jsonStr);
              const data = JSON.parse(jsonStr);
              console.log('解析后的数据:', data);
              if (data.result && data.result.response) {
                onMessage({
                  eventType: 'message',
                  data: {
                    response: data.result.response
                  }
                });
              }
            } catch (e) {
              console.warn('解析流数据失败:', line, e);
            }
          }
        }
      }
    } catch (error) {
      console.error('流式聊天错误:', error);
      onError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async streamAgentChat(
    request: AgentChatRequest,
    onMessage: (response: StreamResponse) => void,
    onError: (error: string) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      console.log('发送Agent聊天请求:', request);
      const response = await fetch(`${BASE_URL}/bot/chat_stream`, {
        method: 'POST',
        headers: {
          'Authorization': this.apikey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('收到响应状态:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('错误响应内容:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // 处理最后可能剩余的数据
          if (buffer.trim()) {
            const lines = buffer.split('\n');
            for (const line of lines) {
              if (line.trim() === '') continue;
              
              if (line.startsWith('data:')) {
                try {
                  const jsonStr = line.slice(5);
                  console.log('解析数据行:', jsonStr);
                  const data = JSON.parse(jsonStr);
                  console.log('解析后的数据:', data);
                  if (data.result && data.result.response) {
                    onMessage({
                      eventType: 'message',
                      data: {
                        response: data.result.response
                      }
                    });
                  }
                } catch (e) {
                  console.warn('解析流数据失败:', line, e);
                }
              }
            }
          }
          console.log('流式响应完成');
          onComplete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('收到数据块:', chunk);
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          if (line.startsWith('data:')) {
            try {
              const jsonStr = line.slice(5);
              console.log('解析数据行:', jsonStr);
              const data = JSON.parse(jsonStr);
              console.log('解析后的数据:', data);
              if (data.result && data.result.response) {
                onMessage({
                  eventType: 'message',
                  data: {
                    response: data.result.response
                  }
                });
              }
            } catch (e) {
              console.warn('解析流数据失败:', line, e);
            }
          }
        }
      }
    } catch (error) {
      console.error('流式聊天错误:', error);
      onError(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export const chatService = new ChatService();