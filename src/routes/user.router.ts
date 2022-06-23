import express from 'express';
import { handleAsyncWrap } from '../middleware';
import { userController } from '../controllers';
const router = express.Router();

router.post('/create', handleAsyncWrap(userController.userCreate));
router.post('/login', handleAsyncWrap(userController.userLogin));
router.get('/profile', handleAsyncWrap(userController.getProfile));
router.patch('/profile', handleAsyncWrap(userController.updateProfile));
router.post('/update_password', handleAsyncWrap(userController.updatePassword));

// router.get('/facebook', handleAsyncWrap(thirdPartyController.loginWithFacebook));
// router.get('/facebook/callback', handleAsyncWrap(thirdPartyController.facebookCallback));
// router.get('/google', handleAsyncWrap(thirdPartyController.loginWithGoogle));
// router.get('/google/callback', handleAsyncWrap(thirdPartyController.googleCallback));
// router.get('/line', handleAsyncWrap(thirdPartyController.loginWithLine));
// router.get('/line/callback', handleAsyncWrap(thirdPartyController.lineCallback));
// router.get('/discord', handleAsyncWrap(thirdPartyController.loginWithDiscord));
// router.get('/discord/callback', handleAsyncWrap(thirdPartyController.discordCallback));

export default router;
