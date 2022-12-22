import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import pg from 'pg'
import authRoute from "./routes/authRoute.js"
import urlRoute from "./routes/urlsRoutes.js"
dotenv.config()


const { Pool } = pg
export const connection = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "shortly",
    password: "root",
})

const app = express()
app.use(express.json())
app.use(cors())

app.use(authRoute)
app.use(urlRoute)


app.listen(5000)
