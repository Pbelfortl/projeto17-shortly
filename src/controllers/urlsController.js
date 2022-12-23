import { nanoid } from "nanoid"
import { connection } from "../app.js"


export async function shortenUrl (req, res){

    const {userId, url} = req.data
    const shortUrl = nanoid(12)

    try{
        await connection.query(`INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1,$2,$3)`,
            [userId, url, shortUrl])
        res.status(201).send(shortUrl)
        
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function getUrl (req, res){

    const urlId = req.params.id

    try{
        const url = (await connection.query(`SELECT * FROM urls WHERE id = $1`, [urlId])).rows[0]
        res.status(200).send({id:url.id, shortUrl: url.shortUrl, url: url.url})
    } catch (err){
        res.sendStatus(404)
    }
}

export async function getMine (req, res) {

    const {userId} = req.data

    try {

        const urls = await connection.query(`
            SELECT users.id as id, users.name as name, SUM(urls."visitCount") as "visitCount",
            (SELECT json_agg (item) FROM (SELECT urls.id as id, urls."shortUrl" as "shortUrl", urls.url as url, urls."visitCount" as "visitCount"
            FROM urls WHERE urls."userId" = $1) item) as "shortenedUrls"
            FROM users JOIN urls ON urls."userId" = users.id WHERE users.id = $1 GROUP BY users.id `, [userId])
        
        res.status(200).send(urls.rows[0])

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}


export async function openUrl (req, res) {

    const shortUrl = req.params.shortUrl

    try{
        const url = (await connection.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl])).rows[0]

        console.log(url)
        if (!url) {
            return res.senStatus(404)
        }

        await connection.query(`UPDATE urls SET "visitCount" = "visitCount"+1 WHERE id = $1`, [url.id])

        res.redirect(url.url)

    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

export async function deleteUrl (req, res) {

    const {userId, email} = req.data
    const urlId = req.data.urlId
    
    try {

        await connection.query(`DELETE FROM urls WHERE id = $1`, [urlId])
        res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }

}

export async function getRank (req, res) {

    try {

    const ranking = await connection.query(`
            SELECT users.id as id, 
            users.name as name,
            COUNT(urls."userId") as "linkCount",
            COALESCE(SUM(urls."visitCount"), 0) as "visitCount"
            FROM users LEFT JOIN urls ON urls."userId" = users.id GROUP BY users.id ORDER BY "visitCount" DESC`)

            res.status(200).send(ranking.rows)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}