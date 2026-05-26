
import express, {type Application, type Request, type Response } from 'express'
import config from './config/env';
import { initDB, pool } from './db';
import { userRoute } from './modules/users/user.route';



const app: Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))



app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "WELCOME TO DEV PULSE",
    "author": "DEV PULSE"
  })
})

app.use('/api/users', userRoute)


app.get('/api/users', userRoute)

app.get('/api/users/:id', userRoute)

app.put('/api/users/:id', userRoute)
app.delete('/api/users/:id', userRoute)

export default app