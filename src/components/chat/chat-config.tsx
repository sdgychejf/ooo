"use client";

import { useState, useEffect } from "react";
import { KnowledgeBaseChatRequest, AgentChatRequest } from "@/types/chat";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";

interface ChatConfigProps {
  onConfigChange: (
    config: Partial<KnowledgeBaseChatRequest> | Partial<AgentChatRequest>,
    type: "kb" | "agent"
  ) => void;
  disabled?: boolean;
  apiKey?: string;
}

export function ChatConfig({
  onConfigChange,
  disabled = false,
  apiKey = "",
}: ChatConfigProps) {
  const [chatType, setChatType] = useState<"kb" | "agent">("kb");
  const [searchQuery, setSearchQuery] = useState("");
  const [config, setConfig] = useState<{
    // Knowledge Base Config
    kbIds: string[];
    prompt: string;
    model: string;
    maxToken: string;
    hybridSearch: string;
    networking: string;
    sourceNeeded: string;
    // Agent Config
    uuid: string;
  }>({
    kbIds: [],
    prompt: "",
    model: "QAnything 4o mini",
    maxToken: "1024",
    hybridSearch: "false",
    networking: "true",
    sourceNeeded: "true",
    uuid: "",
  });

  const { knowledgeBases, fetchKnowledgeBaseList, loading, error } =
    useKnowledgeBase(apiKey);

  useEffect(() => {
    if (apiKey) {
      fetchKnowledgeBaseList().catch(console.error);
    }
  }, [apiKey, fetchKnowledgeBaseList]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleKbIdsChange = (kbId: string) => {
    setConfig((prev) => {
      const newKbIds = prev.kbIds.includes(kbId)
        ? prev.kbIds.filter((id) => id !== kbId)
        : [...prev.kbIds, kbId];
      return { ...prev, kbIds: newKbIds };
    });
  };

  const handleChatTypeChange = (type: "kb" | "agent") => {
    setChatType(type);

    if (type === "kb") {
      const kbConfig: Partial<KnowledgeBaseChatRequest> = {
        kbIds: config.kbIds,
        prompt: config.prompt,
        model: config.model,
        maxToken: config.maxToken,
        hybridSearch: config.hybridSearch,
        networking: config.networking,
        sourceNeeded: config.sourceNeeded,
      };
      onConfigChange(kbConfig, "kb");
    } else {
      const agentConfig: Partial<AgentChatRequest> = {
        uuid: config.uuid,
        sourceNeeded: config.sourceNeeded,
      };
      onConfigChange(agentConfig, "agent");
    }
  };

  const handleApplyConfig = () => {
    handleChatTypeChange(chatType);
  };

  const filteredKnowledgeBases = searchQuery
    ? knowledgeBases.filter(
        (kb) =>
          kb.kbName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kb.kbId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : knowledgeBases;

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <h3 className="text-lg font-semibold">聊天配置</h3>

      {/* Chat Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          聊天类型
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="chatType"
              value="kb"
              checked={chatType === "kb"}
              onChange={() => setChatType("kb")}
              disabled={disabled}
              className="mr-2"
            />
            知识库问答
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="chatType"
              value="agent"
              checked={chatType === "agent"}
              onChange={() => setChatType("agent")}
              disabled={disabled}
              className="mr-2"
            />
            Agent问答
          </label>
        </div>
      </div>

      {/* Knowledge Base Config */}
      {chatType === "kb" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择知识库 *
            </label>
            {error ? (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索知识库..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={disabled || loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                  {loading ? (
                    <div className="text-center py-4 text-gray-500">
                      加载中...
                    </div>
                  ) : filteredKnowledgeBases.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      {searchQuery ? "未找到匹配的知识库" : "暂无知识库"}
                    </div>
                  ) : (
                    filteredKnowledgeBases.map((kb) => (
                      <div
                        key={kb.kbId}
                        className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                          config.kbIds.includes(kb.kbId) ? "bg-blue-50" : ""
                        }`}
                        onClick={() => !disabled && handleKbIdsChange(kb.kbId)}
                      >
                        <input
                          type="checkbox"
                          checked={config.kbIds.includes(kb.kbId)}
                          onChange={() => {}}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{kb.kbName}</div>
                          <div className="text-sm text-gray-500">{kb.kbId}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {config.kbIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {config.kbIds.map((kbId) => {
                      const kb = knowledgeBases.find((k) => k.kbId === kbId);
                      return (
                        <span
                          key={kbId}
                          className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-800"
                        >
                          {kb?.kbName || kbId}
                          <button
                            onClick={() => !disabled && handleKbIdsChange(kbId)}
                            className="ml-1 hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {!apiKey && (
              <div className="text-yellow-500 text-sm mt-1">
                请先配置 API Key
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              自定义提示词
            </label>
            <textarea
              name="prompt"
              value={config.prompt}
              onChange={handleInputChange}
              disabled={disabled}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型
              </label>
              <select
                name="model"
                value={config.model}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="QAnything 4o mini">QAnything 4o mini</option>
                <option value="QAnything 16k">QAnything 16k</option>
                <option value="deepseek-lite">DeepSeek Lite</option>
                <option value="deepseek-pro">DeepSeek Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大Token
              </label>
              <select
                name="maxToken"
                value={config.maxToken}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1024">1024</option>
                <option value="2048">2048</option>
                <option value="4096">4096</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                混合搜索
              </label>
              <select
                name="hybridSearch"
                value={config.hybridSearch}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="false">禁用</option>
                <option value="true">启用</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                网络搜索
              </label>
              <select
                name="networking"
                value={config.networking}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="false">禁用</option>
                <option value="true">启用</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                需要来源
              </label>
              <select
                name="sourceNeeded"
                value={config.sourceNeeded}
                onChange={handleInputChange}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="false">不需要</option>
                <option value="true">需要</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Agent Config */}
      {chatType === "agent" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent UUID *
            </label>
            <input
              type="text"
              name="uuid"
              value={config.uuid}
              onChange={handleInputChange}
              disabled={disabled}
              placeholder="C1BDCFC4F33747E7"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              需要来源
            </label>
            <select
              name="sourceNeeded"
              value={config.sourceNeeded}
              onChange={handleInputChange}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">不需要</option>
              <option value="true">需要</option>
            </select>
          </div>
        </div>
      )}

      <button
        onClick={handleApplyConfig}
        disabled={disabled}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        应用配置
      </button>
    </div>
  );
}
