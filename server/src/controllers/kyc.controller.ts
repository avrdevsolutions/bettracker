import {KycService} from "../services/kyc.service.js";
import {Request, Response} from "express";

export class KycController {
    constructor(private kycService = new KycService()) {}

    getSubmissions = async (_req: Request, res: Response) => {
        const submissions = await this.kycService.getSubmissions();
        res.status(200).json(submissions);
    };

    getUploadUrl = async (req: Request, res: Response) => {
        const { docType } = req.body;
        const result = await this.kycService.getUploadUrl(req.user.userId, docType);
        res.status(200).json(result);
    };

    getDocumentUrl = async (req: Request, res: Response) => {
        const url = await this.kycService.getDocumentUrl(req.params.id as string);
        res.status(200).json({ url });
    };

    submit = async (req: Request, res: Response) => {
        const user = await this.kycService.submit(req.user.userId);
        res.status(200).json(user);
    };

    verify = async (req: Request, res: Response) => {
        const { approved } = req.body;
        const result = await this.kycService.verify(req.params.userId as string, approved);
        res.status(200).json(result);
    };
}
