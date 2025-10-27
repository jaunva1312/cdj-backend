import {Router} from 'express'
import User from '../controllers/user.controller.js'
import  {authJwt}  from '../middlewares/index.js'

const router = Router()

router.get('/users', [authJwt.verifyToken,  authJwt.isAdmin], User.getUsers);

router.get('/user/:id', [authJwt.verifyToken,  authJwt.isAdmin], User.getUser);

//router.post('/user', [authJwt.verifyToken,  authJwt.isAdmin], User.createUser);

router.patch('/user/:id', [authJwt.verifyToken,  authJwt.isAdmin], User.updateUser);

router.delete('/user/:id', [authJwt.verifyToken,  authJwt.isAdmin], User.deleteUser);




export default router