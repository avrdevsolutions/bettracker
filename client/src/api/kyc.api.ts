import axios from 'axios';
import { apiClient } from './client';
import type { KycUploadResponse, KycSubmission, DocType } from '@/types/api';

export const kycApi = {
  getSubmissions: () =>
    apiClient.get<KycSubmission[]>('/kyc/submissions').then((res) => res.data),

  getUploadUrl: (docType: DocType) =>
    apiClient
      .post<KycUploadResponse>('/kyc/upload', { docType })
      .then((res) => res.data),

  /** Upload a file directly to S3 via the signed URL. */
  uploadToS3: (url: string, file: File) =>
    axios.put(url, file, {
      headers: { 'Content-Type': file.type },
    }),

  getDocumentUrl: (documentId: string) =>
    apiClient
      .get<{ url: string }>(`/kyc/documents/${documentId}/url`)
      .then((res) => res.data),

  submit: () =>
    apiClient.post('/kyc/submit').then((res) => res.data),

  verify: (userId: string, approved: boolean) =>
    apiClient
      .patch(`/kyc/verify/${userId}`, { approved })
      .then((res) => res.data),

  updateProfile: (data: { full_name: string; address: string }) =>
    apiClient.put('/users/me', data).then((res) => res.data),
};
