import express from 'express'
import {router,authrouter} from './routes/userRoutes.js'
import postRouter from './routes/postRoutes.js'
import commentRouter from './routes/commentRoutes.js'
import { handleError } from './utils/errorhandler.js'
import { AppError } from './utils/errorhandler.js'
import swaggerUi from "swagger-ui-express";
import specs from "./middlewares/swagger.js";
const app = express()
app.use(express.json())




app.use('/uploads', express.static('uploads'));



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/auth',authrouter)
app.use('/api/users',router)
app.use('/api/posts',postRouter)
app.use('/api/comments',commentRouter)



app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(handleError)

export default app