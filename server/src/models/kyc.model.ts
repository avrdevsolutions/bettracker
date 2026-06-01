type DocType = 'passport' | 'proof_of_address' | 'driving_license'
type DocStatus = 'pending' | 'approved' | 'rejected'

type KycDocument = {
    id: string;
    user_id: string;
    doc_type: DocType;
    s3_key: string;
    status: DocStatus;
    created_at: Date;
}

export { KycDocument, DocType, DocStatus }