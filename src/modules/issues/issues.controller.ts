import type { Request, Response } from "express";
import { IssueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {


    try {
        const result = await IssueService.createIssueIntoDB(req.body)
        res.status(201).json({
            seccess: true,
            message: "Issue created successfully!",
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            seccess: false,
            message: error.message,
            error: error

        })

    }

}


export const issuController = {
    createIssue
}