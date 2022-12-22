import signUpSchema from "../schemas/signUpSchema.js"
import { connection } from "../app.js"
import signInSchema from "../schemas/signInSchema.js"
import bcrypt from "bcrypt"

export async function signUpValidation(req, res, next) {

    const user = req.body

    const alreadyRegistered = await connection.query("SELECT * FROM users WHERE email = $1", [user.email])
    const userValidation = signUpSchema.validate(user)

    if (userValidation.error) {
        return res.sendStatus(422)
    }

    if (alreadyRegistered.rowCount > 0) {
        return res.sendStatus(409)
    }

    req.user = user

    next()
}

export async function singInValidation(req, res, next) {

    const { email, password } = req.body
    const validation = signInSchema.validate(req.body)

    if (validation.error) {
        return res.sendStatus(422)
    }

    try {
        const checkUser = (await connection.query("SELECT * FROM users WHERE email=$1", [email])).rows[0]

        if (!checkUser){

            return res.sendStatus(401)
        }

        const checkPassword = bcrypt.compareSync(password, checkUser?.password)

        if (!checkPassword) {
            return res.sendStatus(401)
        }

        req.user = checkUser

    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
    
    
    next()
}