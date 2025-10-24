import {Router} from 'express'
import * as emailservice from './email.service.js'
const router = Router()
router.post('/resend/:id',emailservice.resendEmail)
export default router