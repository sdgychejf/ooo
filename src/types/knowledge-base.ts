// 知识库相关的类型定义

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface KnowledgeBase {
  kbId: string;
  kbName: string;
  createTime?: string;
  updateTime?: string;
}

export interface Document {
  fileId: string;
  fileName: string;
  fileSize?: number;
  uploadTime?: string;
  status?: 'processing' | 'success' | 'failed';
}

export interface FAQ {
  faqId: string;
  question: string;
  answer: string;
  createTime?: string;
  updateTime?: string;
}

// API 请求参数类型
export interface CreateKbRequest {
  kbName: string;
}

export interface DeleteKbRequest {
  kbId: string;
}

export interface UploadFileRequest {
  kbId: string;
  file: File;
}

export interface UploadUrlRequest {
  kbId: string;
  url: string;
}

export interface DeleteFileRequest {
  kbId: string;
  fileIds: string[];
}

export interface UpdateKbNameRequest {
  kbId: string;
  kbName: string;
}

export interface CreateFAQRequest {
  kbId: string;
  question: string;
  answer: string;
}

export interface UpdateFAQRequest {
  kbId: string;
  faqId: string;
  question: string;
  answer: string;
}

export interface DeleteFAQRequest {
  kbId: string;
  faqIds: string[];
}

export interface GetFAQDetailRequest {
  kbId: string;
  faqId: string;
}

// API 响应数据类型
export interface CreateKbResponse {
  kbId: string;
}

export interface KbListResponse {
  kbList: KnowledgeBase[];
}

export interface FileListResponse {
  fileList: Document[];
}

export interface FAQListResponse {
  faqList: FAQ[];
}

export interface FAQDetailResponse {
  faq: FAQ;
}