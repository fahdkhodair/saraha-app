import { authentication, auth } from "../../middleware/authentication.middleware.js";
import { tokenTypeEnum } from "../../utils/security/token.security.js";
import * as userservice from "./user.service.js"
import * as validators from "./user.validation.js"
import { Router } from "express";
import { endpoint } from "./user.authorization.js";
import { validation } from "../../middleware/validation.middleware.js";
import { multersotrage } from "../../middleware/multer.middleware.js";
import { limit } from "../../middleware/rate-limit.middleware.js";
const router=Router();
router.get('/test',userservice.profile)
router.get('/',
    auth({accessRoles:endpoint.profile}),
    userservice.profile
)
router.get('/:userid',
    validation(validators.shareprofile),
    userservice.shareprofile
)
router.delete('/:userid/freeze-account',
    authentication(),
    validation(validators.freezeAccount),
    userservice.freezeAccount
)
router.patch('/:userid/restore-account',
    auth({accessRoles:endpoint.restoreAccount}),
    validation(validators.restoreAccount),
    userservice.restoreAccount
)
router.patch('/password',
    authentication(),
    validation(validators.updatepassword),
    userservice.updatepassword
)
router.delete('/:userid',
    validation(validators.deleteAccount),
    userservice.deleteAccount
)
router.get('/refresh-token',
    authentication({tokenType:tokenTypeEnum.refresh}),
    userservice.getNewLoginCredentials
)
router.post('/update', multersotrage().single('profile'), userservice.uploadprofileservice);

export default router;