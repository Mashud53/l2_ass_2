import type { Request, Response } from "express"
import { authService } from "./auth.service"
import sendResponse from "../../utility/sendResponse"

const signInUser = async(req: Request, res: Response)=>{
    try {
    const result = await authService.signInUserIntoDB(req.body)

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully",
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
const loginUser = async(req: Request, res:Response)=>{
try {
    const result = await authService.loginUserIntoDB(req.body)
        
    
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message:  "User Login successfully!",
            data: result
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


export const authController ={
    signInUser,
    loginUser
}