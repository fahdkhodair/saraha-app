import { Router } from "express";
import * as messageservice from "./message.service.js"
const router = Router()
router.post("/send-messages/:receiverId",messageservice.sendmessage)
router.get("/",messageservice.getMessageservice)
export default router