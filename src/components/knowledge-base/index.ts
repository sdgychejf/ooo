// 知识库组件的统一导出

export { default as KnowledgeBaseList } from './knowledge-base-list';
export { default as CreateKnowledgeBaseForm } from './create-knowledge-base-form';
export { default as FileUpload } from './file-upload';
export { default as DocumentList } from './document-list';

// 也可以导出类型
export type { KnowledgeBase, Document, FAQ } from '@/types/knowledge-base';