import { Router } from "express";
import { deleteUrl, getMine, getRank, getUrl, openUrl, shortenUrl } from "../controllers/urlsController.js";
import { validateDelete, validateToken, validateUrl } from "../middlewares/urlsMiddlewares.js";


const urlRoute = Router()

urlRoute.post("/urls/shorten", validateUrl, shortenUrl)
urlRoute.get("/urls/:id", getUrl)
urlRoute.get("/urls/open/:shortUrl", openUrl)
urlRoute.get("/users/me",validateToken, getMine)
urlRoute.get("/ranking", getRank)
urlRoute.delete("/urls/:id",validateDelete, deleteUrl)

export default urlRoute