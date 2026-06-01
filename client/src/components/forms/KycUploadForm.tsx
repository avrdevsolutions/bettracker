import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useKycFullSubmit } from '@/hooks/useKyc';
import { kycUploadSchema, type KycUploadFormData } from '@/lib/validators';
import { cn } from '@/lib/cn';
import type { DocType } from '@/types/api';

const docTypeOptions: { value: DocType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving Licence' },
  { value: 'proof_of_address', label: 'Proof of Address' },
];

export function KycUploadForm() {
  const submitKyc = useKycFullSubmit();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KycUploadFormData>({
    resolver: zodResolver(kycUploadSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileError(null);

    if (file) {
      // Validate file type
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowed.includes(file.type)) {
        setFileError('Accepted formats: JPEG, PNG, WebP, PDF');
        setSelectedFile(null);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File must be under 5 MB');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const onSubmit = (data: KycUploadFormData) => {
    if (!selectedFile) {
      setFileError('Please select a document to upload');
      return;
    }

    submitKyc.mutate({
      docType: data.doc_type,
      fullName: data.full_name,
      address: data.address,
      file: selectedFile,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grain relative overflow-hidden">
      <div className="p-5 pb-4">
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-text-muted">
          Upload Document
        </h3>
      </div>

      <div className="divider-gradient" />

      <div className="space-y-5 p-5">
        {/* ── Document type ── */}
        <div>
          <label
            htmlFor="doc_type"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted"
          >
            Document Type
          </label>
          <select
            id="doc_type"
            {...register('doc_type')}
            className="input-field"
            defaultValue=""
          >
            <option value="" disabled>
              Select document type
            </option>
            {docTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.doc_type && (
            <p className="mt-1 text-[11px] text-loss">{errors.doc_type.message}</p>
          )}
        </div>

        {/* ── Full name ── */}
        <div>
          <label
            htmlFor="full_name"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted"
          >
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            {...register('full_name')}
            className="input-field"
            placeholder="As shown on your document"
          />
          {errors.full_name && (
            <p className="mt-1 text-[11px] text-loss">{errors.full_name.message}</p>
          )}
        </div>

        {/* ── Address ── */}
        <div>
          <label
            htmlFor="address"
            className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register('address')}
            className="input-field"
            placeholder="Your residential address"
          />
          {errors.address && (
            <p className="mt-1 text-[11px] text-loss">{errors.address.message}</p>
          )}
        </div>

        {/* ── File upload ── */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Document Image
          </label>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'w-full rounded-md bg-surface px-4 py-3 text-left text-[13px] transition-colors',
              'border border-border-subtle hover:border-border-focus hover:bg-surface-raised',
              selectedFile ? 'text-text-primary' : 'text-text-muted',
            )}
          >
            {selectedFile ? selectedFile.name : 'Choose file...'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {fileError && (
            <p className="mt-1 text-[11px] text-loss">{fileError}</p>
          )}

          <p className="mt-1.5 text-[10px] text-text-muted">
            JPEG, PNG, WebP or PDF. Max 5 MB.
          </p>
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={submitKyc.isPending}
          className="btn-primary w-full font-display text-[13px] uppercase tracking-wider"
        >
          {submitKyc.isPending ? 'Submitting...' : 'Submit for Verification'}
        </button>

        {/* ── Error feedback ── */}
        {submitKyc.isError && (
          <div className="accent-left-loss rounded-r bg-loss-bg/50 py-2 pl-3 pr-3">
            <p className="text-[11px] text-loss">
              {submitKyc.error instanceof Error
                ? submitKyc.error.message
                : 'Submission failed. Please try again.'}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
