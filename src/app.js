import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, //in env file its CORS_ORIGIN=* // kahi se bhi aaye req its ok when *; but acchi baat nahi aapko specifically mention karna chahiye jaha se ara like vercel app or other host.
    Credentials: true

}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))

 
app.use(cookieParser())//mai mere server se user ke browser ke ander ki cookies access aur set kar pau basically CRUD operation kar pau
//no operation inside this are yet used by chai and code 
//================this cookie parser was last =======================
export { app }