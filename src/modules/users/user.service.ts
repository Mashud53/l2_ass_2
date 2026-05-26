import { pool } from "../../db"
import type { IUser } from "./user.interface"

const createUserIntoDB = async (payLoad: IUser) => {
    const { name, email, password, role } = payLoad

    const result = await pool.query(
        `
    INSERT INTO users (name, email,password,role) VALUES($1,$2,$3,$4)
    RETURNING *
    `, [name, email, password, role]
    )
    return result
}

const getAlluserFromDB = async () => {
    const result = await pool.query(`
      SELECT * FROM users
      `)
    return result

}
const getSingleuserFromDB= async(id : string)=>{
     const result = await pool.query(`
      SELECT * FROM users WHERE id=$1
      `, [id])
      return result

}

const updateUserFromDB = async (payLoad: IUser, id: string) => {
    const { name, password, role } = payLoad
    const result = await pool.query(`
      UPDATE users
      SET 
      name=COALESCE($1,name),password=COALESCE($2,password),role=COALESCE($3,role)
      WHERE id=$4 RETURNING * 
      `, [name, password, role, id])
    return result
}

const deleteUserFromDB = async (id: string) => {
    const result = await pool.query(
        `
      DELETE FROM users
      WHERE id=$1
      `, [id]
    )
    return result
}

export const userService = {
    createUserIntoDB,
    getAlluserFromDB,
    getSingleuserFromDB,
    updateUserFromDB,
    deleteUserFromDB
}