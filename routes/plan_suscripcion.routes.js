const { Router } = require('express')
const { plan_suscripcionPost, plan_suscripcionPut, suscripcion_empresa, lista_suscripcion } = require('../controllers/plan_suscripcion.controller')
const { validarCampos } = require('../middlewares/validarCampos.middlewares')
const { validarJWT } = require('../middlewares/validarJWT.middlewares')
const { esAdminRole } = require('../middlewares/validarRoles.middlewares')
const { check } = require('express-validator')
const { esUidValido } = require('../middlewares/db_validator.middlewares')
const router = Router()

router.post('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], plan_suscripcionPost)

router.put('/:uid_plan', [
    validarJWT,
    esAdminRole,
    validarCampos
], plan_suscripcionPut)

router.post('/suscripcion_empresa', [
    check('uid_empresa').custom((uid_empresa) => esUidValido(uid_empresa)),
    validarCampos
], suscripcion_empresa)

router.get('/lista_suscripcion_empresa/:uid_empresa', [
    check('uid_empresa').custom((uid_empresa) => esUidValido(uid_empresa)),
    validarJWT,
    validarCampos
], lista_suscripcion)


module.exports = router