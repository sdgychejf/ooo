"use client";

import { Agent } from "@/types/agent";

interface AgentDetailProps {
  agent: Agent;
  onClose: () => void;
  onEdit: (agent: Agent) => void;
  onManageKnowledgeBases?: (agent: Agent) => void;
}

export function AgentDetail({ agent, onClose, onEdit, onManageKnowledgeBases }: AgentDetailProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Agent详情</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(agent)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            编辑
          </button>
          {onManageKnowledgeBases && (
            <button
              onClick={() => onManageKnowledgeBases(agent)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              管理知识库
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            关闭
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent名称
            </label>
            <div className="p-2 bg-gray-50 rounded">{agent.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UUID
            </label>
            <div className="p-2 bg-gray-50 rounded font-mono text-sm">
              {agent.uuid}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agent描述
          </label>
          <div className="p-2 bg-gray-50 rounded">{agent.description}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型
            </label>
            <div className="p-2 bg-gray-50 rounded">{agent.model}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大Token
            </label>
            <div className="p-2 bg-gray-50 rounded">{agent.maxToken}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              混合搜索
            </label>
            <div className="p-2 bg-gray-50 rounded">
              {agent.hybridSearch ? "启用" : "禁用"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              网络搜索
            </label>
            <div className="p-2 bg-gray-50 rounded">
              {agent.networking ? "启用" : "禁用"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              需要来源
            </label>
            <div className="p-2 bg-gray-50 rounded">
              {agent.needSource ? "需要" : "不需要"}
            </div>
          </div>
        </div>

        {agent.promptSetting && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              提示设置
            </label>
            <div className="p-2 bg-gray-50 rounded whitespace-pre-wrap">
              {agent.promptSetting}
            </div>
          </div>
        )}

        {agent.welcomeMessage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              欢迎消息
            </label>
            <div className="p-2 bg-gray-50 rounded whitespace-pre-wrap">
              {agent.welcomeMessage}
            </div>
          </div>
        )}

        {agent.kbIds && agent.kbIds.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              绑定的知识库
            </label>
            <div className="p-2 bg-gray-50 rounded">
              {agent.kbIds.map((kbId, index) => (
                <div key={index} className="font-mono text-sm text-gray-600">
                  {kbId}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
