'use client';

import { useState, useCallback } from 'react';
import { KnowledgeBaseClient } from '@/lib/knowledge-base-client';
import type {
  KnowledgeBase,
  Document,
  FAQ,
  CreateKbRequest,
  UploadFileRequest,
  UploadUrlRequest,
  DeleteFileRequest,
  UpdateKbNameRequest,
  CreateFAQRequest,
  UpdateFAQRequest,
  DeleteFAQRequest,
  GetFAQDetailRequest,
} from '@/types/knowledge-base';

interface UseKnowledgeBaseState {
  loading: boolean;
  error: string | null;
  knowledgeBases: KnowledgeBase[];
  documents: Document[];
  faqs: FAQ[];
}

export function useKnowledgeBase(apiKey: string) {
  const [state, setState] = useState<UseKnowledgeBaseState>({
    loading: false,
    error: null,
    knowledgeBases: [],
    documents: [],
    faqs: [],
  });

  const client = new KnowledgeBaseClient(apiKey);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // 创建知识库
  const createKnowledgeBase = useCallback(async (request: CreateKbRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.createKnowledgeBase(request);
      if (response.code === 0) {
        await fetchKnowledgeBaseList(); // 刷新列表
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建知识库失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 删除知识库
  const deleteKnowledgeBase = useCallback(async (kbId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.deleteKnowledgeBase({ kbId });
      if (response.code === 0) {
        await fetchKnowledgeBaseList(); // 刷新列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除知识库失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 获取知识库列表
  const fetchKnowledgeBaseList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.getKnowledgeBaseList();
      if (response.code === 0 && response.data) {
        setState(prev => ({
          ...prev,
          knowledgeBases: response.data!.kbList,
        }));
        return response.data.kbList;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取知识库列表失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 上传文件
  const uploadFile = useCallback(async (request: UploadFileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.uploadFile(request);
      if (response.code === 0) {
        await fetchFileList(request.kbId); // 刷新文件列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传文件失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 上传URL
  const uploadUrl = useCallback(async (request: UploadUrlRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.uploadUrl(request);
      if (response.code === 0) {
        await fetchFileList(request.kbId); // 刷新文件列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '上传URL失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 删除文件
  const deleteFiles = useCallback(async (request: DeleteFileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.deleteFiles(request);
      if (response.code === 0) {
        await fetchFileList(request.kbId); // 刷新文件列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除文件失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 获取文件列表
  const fetchFileList = useCallback(async (kbId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.getFileList(kbId);
      if (response.code === 0 && response.data) {
        setState(prev => ({
          ...prev,
          documents: response.data!.fileList,
        }));
        return response.data.fileList;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取文件列表失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 更新知识库名称
  const updateKnowledgeBaseName = useCallback(async (request: UpdateKbNameRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.updateKnowledgeBaseName(request);
      if (response.code === 0) {
        await fetchKnowledgeBaseList(); // 刷新列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新知识库名称失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 创建FAQ
  const createFAQ = useCallback(async (request: CreateFAQRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.createFAQ(request);
      if (response.code === 0) {
        await fetchFAQList(request.kbId); // 刷新FAQ列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建FAQ失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 更新FAQ
  const updateFAQ = useCallback(async (request: UpdateFAQRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.updateFAQ(request);
      if (response.code === 0) {
        await fetchFAQList(request.kbId); // 刷新FAQ列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新FAQ失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 删除FAQ
  const deleteFAQs = useCallback(async (request: DeleteFAQRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.deleteFAQs(request);
      if (response.code === 0) {
        await fetchFAQList(request.kbId); // 刷新FAQ列表
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除FAQ失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 获取FAQ列表
  const fetchFAQList = useCallback(async (kbId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.getFAQList(kbId);
      if (response.code === 0 && response.data) {
        setState(prev => ({
          ...prev,
          faqs: response.data!.faqList,
        }));
        return response.data.faqList;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取FAQ列表失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  // 获取FAQ详情
  const fetchFAQDetail = useCallback(async (request: GetFAQDetailRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.getFAQDetail(request);
      if (response.code === 0 && response.data) {
        return response.data.faq;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取FAQ详情失败';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [client]);

  return {
    // 状态
    ...state,
    
    // 知识库操作
    createKnowledgeBase,
    deleteKnowledgeBase,
    fetchKnowledgeBaseList,
    updateKnowledgeBaseName,
    
    // 文档操作
    uploadFile,
    uploadUrl,
    deleteFiles,
    fetchFileList,
    
    // FAQ操作
    createFAQ,
    updateFAQ,
    deleteFAQs,
    fetchFAQList,
    fetchFAQDetail,
  };
}