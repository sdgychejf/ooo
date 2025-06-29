'use client';

import { useState, useCallback } from 'react';
import { ChatInterface } from './chat-interface';
import { ChatConfig, ChatConfig as ChatConfigType } from './chat-config';

interface ChatDashboardProps {
  apiKey: string;
}

export function ChatDashboard({ apiKey }: ChatDashboardProps) {
  const [config, setConfig] = useState<ChatConfigType>({
    mode: 'knowledge-base',
    kbIds: [],
    agentUuid: '',
    model: 'QAnything 4o mini',
    maxToken: '1024',
    hybridSearch: false,
    networking: true,
    sourceNeeded: true,
  });

  const handleConfigChange = useCallback((newConfig: ChatConfigType) => {
    setConfig(newConfig);
  }, []);

  const isConfigValid = () => {
    if (config.mode === 'knowledge-base') {
      return config.kbIds.length > 0;
    } else if (config.mode === 'agent') {
      return config.agentUuid !== '';
    }
    return false;
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row gap-6">
      {/* Configuration Panel */}
      <div className="lg:w-1/3 xl:w-1/4">
        <div className="sticky top-0">
          <ChatConfig 
            apiKey={apiKey} 
            onConfigChange={handleConfigChange}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col min-h-0">
        {isConfigValid() ? (
          <ChatInterface
            apiKey={apiKey}
            mode={config.mode}
            kbIds={config.kbIds}
            agentUuid={config.agentUuid}
            model={config.model}
            maxToken={config.maxToken}
            hybridSearch={config.hybridSearch}
            networking={config.networking}
            sourceNeeded={config.sourceNeeded}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">请先配置聊天参数</p>
              <p className="text-sm">
                {config.mode === 'knowledge-base' 
                  ? '请选择至少一个知识库' 
                  : '请选择一个Agent'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}