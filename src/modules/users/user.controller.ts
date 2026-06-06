import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {


  try {
    const result = await userService.createUserIntoDB(req.body)

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

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAlluserFromDB()

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrived successfully!",
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

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleuserFromDB(id as string)
    if (result.rows.length === 0) {
      
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found!",
        data: {}
      })

    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrived successfully!",
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

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.updateUserFromDB(req.body, id as string)
    if (result.rows.length === 0) {

      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: {}
      })

    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users updated successfully!",
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

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id as string)
    if (result.rowCount === 0) {

      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
        data: {}
      })
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User deleted successfully!",
      data: {}
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


export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
}

