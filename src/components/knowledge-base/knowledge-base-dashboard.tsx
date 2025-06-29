'use client';

import { useState } from 'react';
import { KnowledgeBaseList, CreateKnowledgeBaseForm, FileUpload, DocumentList } from './index';
import type { KnowledgeBase } from '@/types/knowledge-base';

interface KnowledgeBaseDashboardProps {
  apiKey: string;
}

export default function KnowledgeBaseDashboard({ apiKey }: KnowledgeBaseDashboardProps) {
  const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'upload'>('documents');

  const handleSelectKb = (kb: KnowledgeBase) => {
    setSelectedKb(kb);
    setActiveTab('documents');
  };

  const handleCreateSuccess = (kbId: string) => {
    setShowCreateForm(false);
    // 可以选择自动选中新创建的知识库
  };

  const handleCreateCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">知识库管理</h1>
        <p className="mt-2 text-gray-600">管理您的知识库、文档和FAQ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：知识库列表 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6">
            {showCreateForm ? (
              <CreateKnowledgeBaseForm
                apiKey={apiKey}
                onSuccess={handleCreateSuccess}
                onCancel={handleCreateCancel}
              />
            ) : (
              <KnowledgeBaseList
                apiKey={apiKey}
                onSelectKb={handleSelectKb}
                onCreateKb={() => setShowCreateForm(true)}
                onDeleteKb={() => {
                  // 如果删除的是当前选中的知识库，清空选择
                  if (selectedKb) {
                    setSelectedKb(null);
                  }
                }}
                onEditKb={(kb) => {
                  // 可以实现编辑功能
                  console.log('编辑知识库:', kb);
                }}
              />
            )}
          </div>
        </div>

        {/* 右侧：知识库详情 */}
        <div className="lg:col-span-2">
          {selectedKb ? (
            <div className="bg-white rounded-lg border">
              {/* 知识库信息头部 */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedKb.kbName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">ID: {selectedKb.kbId}</p>
                    {selectedKb.createTime && (
                      <p className="text-xs text-gray-400 mt-1">
                        创建时间: {new Date(selectedKb.createTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedKb(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 标签页导航 */}
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'documents'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    文档管理
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'upload'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    上传文档
                  </button>
                </nav>
              </div>

              {/* 标签页内容 */}
              <div className="p-6">
                {activeTab === 'documents' && (
                  <DocumentList
                    apiKey={apiKey}
                    kbId={selectedKb.kbId}
                    onDeleteSuccess={() => {
                      // 可以添加删除成功后的处理
                    }}
                  />
                )}
                
                {activeTab === 'upload' && (
                  <FileUpload
                    apiKey={apiKey}
                    kbId={selectedKb.kbId}
                    onUploadSuccess={() => {
                      // 上传成功后切换到文档列表
                      setActiveTab('documents');
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-12 text-center">
              <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">选择知识库</h3>
              <p className="text-gray-500">
                从左侧列表中选择一个知识库来管理文档和FAQ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}