import express, { Express } from 'express'
import AuthRoutes from './Routes/AuthRoutes'
import VideoRoutes from './Routes/VideoRoutes'

const getApiRoute = (name: String) => `/api/${name}`
const app: Express = express()
const authRoutes = new AuthRoutes()
const videoRoutes = new VideoRoutes()

app.use(express.json())
app.use(getApiRoute('auth'), authRoutes.buildRouter())
app.use(getApiRoute('video'), videoRoutes.buildRouter())

export default app
