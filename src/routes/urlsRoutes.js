import { Router } from "express";
import { deleteUrl, getMine, getRank, getUrl, openUrl, shortenUrl } from "../controllers/urlsController.js";
import { validateMyUrls, validateToken } from "../middlewares/urlsMiddlewares.js";


const urlRoute = Router()

urlRoute.post("/urls/shorten", validateToken, shortenUrl)
urlRoute.get("/urls/:id", getUrl)
urlRoute.get("/urls/open/:shortUrl", openUrl)
urlRoute.get("/users/me",validateMyUrls, getMine)
urlRoute.get("/ranking", getRank)
urlRoute.delete("/urls/:id", deleteUrl)

export default urlRoute