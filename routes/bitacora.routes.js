const { Router } = require('express')
const { validarCampos } = require('../middlewares/validarCampos.middlewares')
const { validarJWT } = require('../middlewares/validarJWT.middlewares')
const { esAdminRole } = require('../middlewares/validarRoles.middlewares')
const { bitacoraGet } = require('../controllers/bitacora.controller')
const { check } = require('express-validator')
const router = Router()



router.get('/',[
    validarJWT,
    esAdminRole,
    validarCampos
],bitacoraGet)
module.exports = router