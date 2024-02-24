const { Router } = require('express')
const {authLoginPost} = require('../controllers/auth.controller')

const {validarCampos,} = require('../middlewares/exportsMiddlewares')
const router = Router()


router.post('/login',[validarCampos], authLoginPost)


module.exports = router