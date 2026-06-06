import type { Request, Response } from "express";
import { IssueService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {


    try {
        const result = await IssueService.createIssueIntoDB(req.body)
        
         sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully!",
            data: result.rows[0]
        })

    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })

    }

}

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const result = await IssueService.getAllissuesFromDB()

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue retrive successfully!",
            data: result.rows
        })


    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })

    }
}

const getSingleIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await IssueService.getSinlgeissueFromDB(id as string)
        if (result.rows.length === 0) {

            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
                data: {}
            })

        }

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue retrive successfully!",
            data: result.rows
        })


    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })

    }
};

const updateIssue = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await IssueService.updateIssuesIntoDB(req.body, id as string)

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue update successfully!",
            data: result.rows
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })


    }

}

const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await IssueService.deleteIssueFromDb(id as string)
        if (result.rowCount === 0) {

            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
                data: {}
            })



        }
        res.status(201).json({
            seccess: true,
            message: "Issue deleted successfully!",
            data: result.rows
        })
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue deleted successfully!",
            data: result.rows
        })


    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })

    }

}



export const issuController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}