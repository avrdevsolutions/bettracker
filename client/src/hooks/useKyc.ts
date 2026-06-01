import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kycApi } from '@/api/kyc.api';
import { userKeys } from './useAuth';
import type { DocType } from '@/types/api';

export const kycKeys = {
  submissions: ['kyc', 'submissions'] as const,
};

/**
 * Admin: list all users with kyc_status = 'submitted'.
 */
export function useKycSubmissions() {
  return useQuery({
    queryKey: kycKeys.submissions,
    queryFn: kycApi.getSubmissions,
  });
}

/**
 * Get a signed upload URL for a KYC document.
 */
export function useKycUpload() {
  return useMutation({
    mutationFn: (docType: DocType) => kycApi.getUploadUrl(docType),
  });
}

/**
 * Submit KYC for review — transitions status from 'pending' to 'submitted'.
 */
export function useKycSubmit() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => kycApi.submit(),
    onSuccess: () => {
      // Refetch user profile to get updated kyc_status
      qc.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}

/**
 * Admin: verify or reject a user's KYC.
 */
export function useKycVerify() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, approved }: { userId: string; approved: boolean }) =>
      kycApi.verify(userId, approved),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: kycKeys.submissions });
    },
  });
}

/**
 * Update profile (full_name, address) — required before KYC submission.
 */
export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { full_name: string; address: string }) =>
      kycApi.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}

type KycSubmitPayload = {
  docType: DocType;
  fullName: string;
  address: string;
  file: File;
};

/**
 * Full KYC flow: get signed URL → upload file to S3 → update profile → submit.
 *
 * Orchestrates all steps so the form only has to call one mutation.
 */
export function useKycFullSubmit() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ docType, fullName, address, file }: KycSubmitPayload) => {
      // 1. Get signed S3 upload URL
      const { uploadUrl } = await kycApi.getUploadUrl(docType);

      // 2. Upload the file directly to S3
      await kycApi.uploadToS3(uploadUrl, file);

      // 3. Update profile details (name + address)
      await kycApi.updateProfile({ full_name: fullName, address });

      // 4. Submit KYC for review
      return kycApi.submit();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}
