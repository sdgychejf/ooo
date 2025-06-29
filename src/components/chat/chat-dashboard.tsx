"use client";

import { useState, useEffect, useRef } from "react";
import { ChatInterface } from "./chat-interface";
import { ChatConfig } from "./chat-config";
import { ToastContainer } from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";
import { chatService } from "@/services/chatService";
import {
  ChatMessage,
  KnowledgeBaseChatRequest,
  AgentChatRequest,
  StreamResponse,
} from "@/types/chat";

interface ChatDashboardProps {
  apiKey: string;
}

export function ChatDashboard({ apiKey }: ChatDashboardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>();
  const [chatConfig, setChatConfig] = useState<{
    type: "kb" | "agent";
    config: Partial<KnowledgeBaseChatRequest> | Partial<AgentChatRequest>;
  }>({
    type: "kb",
    config: {
      kbIds: [],
      model: "QAnything 4o mini",
      maxToken: "1024",
      hybridSearch: "false",
      networking: "true",
      sourceNeeded: "true",
    },
  });
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const responseRef = useRef("");

  useEffect(() => {
    if (apiKey) {
      chatService.setApiKey(apiKey);
    }
  }, [apiKey]);

  const handleConfigChange = (
    config: Partial<KnowledgeBaseChatRequest> | Partial<AgentChatRequest>,
    type: "kb" | "agent"
  ) => {
    setChatConfig({ type, config });
    showSuccess("配置已更新");
  };

  const handleSendMessage = async (question: string) => {
    if (isStreaming) return;

    setError(undefined);
    setCurrentMessage("");
    setIsStreaming(true);
    responseRef.current = "";

    const onMessage = (streamResponse: StreamResponse) => {
      if (streamResponse.data.response) {
        const newText = streamResponse.data.response;
        console.log("收到新的响应片段:", newText);
        responseRef.current += newText;
        console.log("当前完整响应:", responseRef.current);
        setCurrentMessage(responseRef.current);
      }
    };

    const onError = (errorMessage: string) => {
      console.error("聊天错误:", errorMessage);
      setError(errorMessage);
      setIsStreaming(false);
      showError(`发送失败: ${errorMessage}`);
    };

    const onComplete = () => {
      console.log("聊天完成，最终响应:", responseRef.current);
      setMessages((prev) => [
        ...prev,
        {
          question,
          response: responseRef.current,
        },
      ]);
      setCurrentMessage("");
      setIsStreaming(false);
    };

    try {
      if (chatConfig.type === "kb") {
        const kbConfig = chatConfig.config as Partial<KnowledgeBaseChatRequest>;
        if (!kbConfig.kbIds || kbConfig.kbIds.length === 0) {
          showError("请先配置知识库ID");
          setIsStreaming(false);
          return;
        }

        const request: KnowledgeBaseChatRequest = {
          question,
          kbIds: kbConfig.kbIds,
          prompt: kbConfig.prompt || "",
          history: messages,
          model: kbConfig.model || "QAnything 4o mini",
          maxToken: kbConfig.maxToken || "1024",
          hybridSearch: kbConfig.hybridSearch || "false",
          networking: kbConfig.networking || "true",
          sourceNeeded: kbConfig.sourceNeeded || "true",
        };

        console.log("发送知识库聊天请求:", request);
        await chatService.streamKnowledgeBaseChat(
          request,
          onMessage,
          onError,
          onComplete
        );
      } else {
        const agentConfig = chatConfig.config as Partial<AgentChatRequest>;
        if (!agentConfig.uuid) {
          showError("请先配置Agent UUID");
          setIsStreaming(false);
          return;
        }

        const request: AgentChatRequest = {
          uuid: agentConfig.uuid,
          question,
          sourceNeeded: agentConfig.sourceNeeded || "true",
          history: messages,
        };

        console.log("发送Agent聊天请求:", request);
        await chatService.streamAgentChat(
          request,
          onMessage,
          onError,
          onComplete
        );
      }
    } catch (err) {
      console.error("发送消息错误:", err);
      onError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentMessage("");
    setError(undefined);
    showSuccess("聊天记录已清空");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stream 对话</h1>
        <button
          onClick={handleClearChat}
          disabled={isStreaming}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          清空聊天
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Configuration */}
        <div className="lg:col-span-1">
          <ChatConfig
            onConfigChange={handleConfigChange}
            disabled={isStreaming}
            apiKey={apiKey}
          />
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3" style={{ height: "600px" }}>
          <ChatInterface
            onSendMessage={handleSendMessage}
            messages={messages}
            currentMessage={currentMessage}
            isStreaming={isStreaming}
            error={error}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
