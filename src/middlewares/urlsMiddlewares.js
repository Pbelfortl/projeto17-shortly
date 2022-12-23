import { connection } from "../app.js"
import urlSchema from "../schemas/urlSchema.js"
import  jwt  from "jsonwebtoken"


export async function validateUrl(req, res, next) {

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
        req.data = {userId:user.userId,email:user.email, url}
        next()

    } catch (err){
        res.status(401).send(err)
    }
    
}

export async function validateToken (req, res, next) {

    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")

    try {
        const user = jwt.verify(token, process.env.TOKEN_KEY)
        req.data = {userId:user.userId, email:user.email}
        next()

    } catch (err){
        console.log(err)
        res.status(401).send(err)
    }
    
}

export async function validateDelete (req, res, next) {

    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")
    const urlId = req.params.id

    try {
        const user = jwt.verify(token, process.env.TOKEN_KEY)
        const url = (await connection.query(`SELECT * FROM urls WHERE id = $1`, [urlId])).rows
        if(url[0].userId !== user.userId){
            return res.sendStatus(401)
        }

        req.data = {userId:user.userId, email:user.email, urlId: urlId}
        next()

    } catch (err){
        res.status(401).send(err)
    }
    
}