import { connection } from "../app.js"
import urlSchema from "../schemas/urlSchema.js"
import  jwt  from "jsonwebtoken"


export async function validateToken (req, res, next) {

    const {authorization} = req.headers
    const {url} = req.body
    const token = authorization?.replace("Bearer ", "")
    const validateUrl = urlSchema.validate({url})
    
    if(validateUrl.error) {

        return res.sendStatus(422)
    }

    try {
        const user = jwt.verify(token, process.env.TOKEN_KEY)
        //const user = await connection.query("SELECT * FROM sessions WHERE token = $1", [token])
        console.log(user)
        req.data = {userId:user.userId,email:user.email, url}
        next()

    } catch (err){
        res.status(401).send(err)
    }
    
}

export async function validateMyUrls (req, res, next) {

    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")

    try {
        const user = jwt.verify(token, process.env.TOKEN_KEY)
        //const user = await connection.query("SELECT * FROM sessions WHERE token = $1", [token])
        req.data = {userId:user.userId,email:user.email}
        next()

    } catch (err){
        console.log(err)
        res.status(401).send(err)
    }
    
}