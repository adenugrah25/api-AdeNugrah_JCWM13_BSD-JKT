const router = require('express').Router()
const { validator, validatePassword } = require('../helpers/validator')

//import controller
const { userController } = require('../controllers')

//create router
// router.get('/users', userController.getUserData)
router.post('/register', validator, userController.register)
router.post('/login', userController.login)
router.patch('/user/deactive/:id', userController.deactiveAcc)
router.get('/user/active/:id', userController.activeAcc)
router.get('/user/close/:id', userController.closeAcc)
module.exports = router