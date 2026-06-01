import {KycRepository} from "../repositories/kyc.repository.js";
import {DocType} from "../models/kyc.model.js";
import {NotFoundError} from "../errors/AppError.js";
import {S3Service} from "./s3.service.js";

export class KycService {
    constructor(
        private kycRepository = new KycRepository(),
        private s3Service = new S3Service()) {}

    async getUploadUrl(userId: string, docType: DocType) {
        const s3Document = await this.s3Service.getKycUploadUrl(userId, docType)
        if(!s3Document) throw new NotFoundError('Document not found')
        const kycDocument = await this.kycRepository.create(userId, docType, s3Document.key)
        if(!kycDocument) throw new NotFoundError('Document not found')
        return { uploadUrl: s3Document.url, document: kycDocument }
    }

    async getDocumentUrl(docId: string) {
        const kycEntry = await this.kycRepository.findById(docId)
        if(!kycEntry) throw new NotFoundError('Entry not found')
        const kycDocumentUrl = await this.s3Service.getKycDownloadUrl(kycEntry.s3_key)
        if(!kycDocumentUrl) throw new NotFoundError('URL not found')
        return kycDocumentUrl
    }

    async getSubmissions() {
        return await this.kycRepository.findSubmittedUsers()
    }

    async submit(userId: string) {
        return await this.kycRepository.updateKycStatus(userId, 'submitted')
    }

    async verify(userId: string, approved: boolean) {
         await this.kycRepository.updateKycStatus(userId, approved ? 'verified' : 'rejected')
        return await this.kycRepository.updateDocStatus(userId, approved ? 'approved' : 'rejected')
    }
}