import { connection } from "../app.js"
import { v4 as uuId } from "uuid"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

export async function signUp (req, res) {

    const {name, email} = req.user
    const password = bcrypt.hashSync(req.user.password, 10)

    try{
        await connection.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, password])
        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err)
    }
}

export async function signIn (req, res) {

    const {id, email} = req.user
    const token = uuId()

    try{
        //const user = await connection.query("SELECT * FROM users WHERE email = $1", [email])
        /* await connection.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, [id, token]) */

        const token = jwt.sign({userId: id, email: email}, process.env.TOKEN_KEY,{expiresIn:'30m'})

        res.status(200).send(token)
    } catch (err) {

        res.status(500).send(err)
    }
}