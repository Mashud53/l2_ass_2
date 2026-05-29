import type { Request, Response } from "express"
import { authService } from "./auth.service"

const loginUser = async(req: Request, res:Response)=>{
try {
    const result = await authService.loginUserIntoDB(req.body)
        
        res.status(201).json({
            seccess: true,
            message: "user retrive successfully!",
            data: result
        })


    } catch (error: any) {
        res.status(500).json({
            seccess: false,
            message: error.message,
            error: error

        })

    }
}

export const authController ={
    loginUser
}