import bcrypt from "bcryptjs";
import { pool } from "../../db"
import type { AuthInterface } from "./auth.interface"
import jwt from "jsonwebtoken"
import config from "../../config/env";

const loginUserIntoDB = async (payload: AuthInterface) => {
    const { email, password } = payload;
    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])
    if (userData.rows.length === 0) {
        throw new Error("Ivalid Crendential!")
    }

    const user = userData.rows[0]

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
        throw new Error("Invalid Crendential")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwt.sign(
        jwtPayload,
        config.secret as string,
        { expiresIn: "1d" }
    )
    
    return { accessToken }



}

export const authService = {
    loginUserIntoDB
}