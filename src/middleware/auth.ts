import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config/env";
import { pool } from "../db";


const auth = (...roles : string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            const token = req.headers.authorization

            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized access!!"
                })
                return
            }

           
            const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload
            const userData = await pool.query(`
                SELECT * FROM users WHERE email=$1
                `, [decoded.email])
            const user = userData.rows[0]
            if(userData.rows.length === 0){
                res.status(404).json({
                    success: false,
                    message: "user not found"
                })
                return

            }
           
            
            if(roles.length && !roles.includes(user.role)){
                res.status(403).json({
                    success: false,
                    messsage: "Forbidden!!"
                })
                return
            }
            req.user = decoded
            next()

        } catch (error) {
            

            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });

        }
    }
}

export default auth