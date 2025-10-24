
import { validation} from "../../middleware/validation.middleware.js";
import * as authservice from "./auth.service.js"
import * as validators from "./auth.validation.js"
import { Router } from "express";
const router=Router();
router.post('/signup',validation(validators.signup),authservice.signup)
router.post('/login',authservice.login)
router.patch("/confirm-email",validation(validators.confirmEmail),authservice.confirmEmail)
router.post('/signup/gmail',validation(validators.loginwithGmail),authservice.signupwithgmail)
router.post('/login/gmail',validation(validators.loginwithGmail),authservice.loginwithgmail)
export default router;