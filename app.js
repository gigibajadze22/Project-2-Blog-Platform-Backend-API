import express from 'express'
import {router,authrouter} from './routes/userRoutes.js'

const app = express()
app.use(express.json())

app.use('/api/auth',authrouter)
app.use('/api/users',router)

export default app