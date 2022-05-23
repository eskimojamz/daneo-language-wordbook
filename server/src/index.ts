import express from 'express'
import cors from 'cors'

const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json)
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))



