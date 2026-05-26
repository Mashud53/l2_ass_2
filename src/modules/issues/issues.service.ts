import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payLoad: IIssue) => {
    const { title, description, type, status, reporter_id } = payLoad
    const user = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `, [reporter_id])

    if (user.rows.length === 0) {
        throw new Error("user not exists")
    }

    const result = pool.query(`
            INSERT INTO issues(title, description, type, status, reporter_id
            ) VALUES($1, $2, $3, $4, $5) RETURNING *
            `, [title, description, type, status, reporter_id])
    return result


}

export const IssueService = {
    createIssueIntoDB
}