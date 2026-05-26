import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import { Result } from "pg";

const createUser = async (req: Request, res: Response) => {
  

  try {
    const result = await userService.createUserIntoDB(req.body)
    res.status(201).json({
      seccess: true,
      message: "User created successfully",
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

const getAllUser =async (req: Request, res: Response) => {
  try {
    const result = await userService.getAlluserFromDB()
   res.status(200).json({
      seccess: true,
      message: "Users retrived successfully!",
      data: result.rows
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error

    })


  }
}

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
   const result =await userService.getSingleuserFromDB(id as string)
    if (result.rows.length === 0) {
      res.status(404).json({
        seccess: false,
        message: "User not found!",
        data: {}
      })

    }
    res.status(200).json({
      seccess: true,
      message: "Users retrived successfully!",
      data: result.rows[0]
    })

  } catch (error: any) {
    res.status(500).json({
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
      res.status(404).json({
        seccess: false,
        message: "User not found!",
        data: {}
      })

    }
    res.status(200).json({
      seccess: true,
      message: "Users updated successfully!",
      data: result.rows[0]
    })

  } catch (error: any) {
    res.status(500).json({
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
      res.status(404).json({
        seccess: false,
        message: "User not found!",
        data: {}
      })
    }
    res.status(200).json({
      seccess: true,
      message: "User deleted successfully!",
      data: {}
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    })


  }
}


export const userController ={
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
}

