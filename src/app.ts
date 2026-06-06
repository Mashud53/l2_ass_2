
import express, {type Application, type Request, type Response } from 'express'

import { userRoute } from './modules/users/user.route';
import { issueRoute } from './modules/issues/issues.route';
import { authRoute } from './modules/auth/auth.rout';
import logger from './middleware/logger';



const app: Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))
app.use(logger)



app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "WELCOME TO DEV PULSE",
    "author": "DEV PULSE"
  })
})

app.use('/api/users', userRoute)
app.use('/api/issues', issueRoute)
app.use('/api/auth', authRoute)


export default app