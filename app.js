import express from 'express'
import {router,authrouter} from './routes/userRoutes.js'
import postRouter from './routes/postRoutes.js'
import commentRouter from './routes/commentRoures.js'
const app = express()
app.use(express.json())

app.use('/api/auth',authrouter)
app.use('/api/users',router)

app.use('/api/posts',postRouter)
app.use('/api/comments',commentRouter)

export default app