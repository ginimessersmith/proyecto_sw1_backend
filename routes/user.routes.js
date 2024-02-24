const { Router } = require('express')

const {
    userGet,
    userPost,
    userDelete,
    userAdminPost,
    userPut } = require('../controllers/user.controllers')


const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/exportsMiddlewares')
const { esEmailValidoUsuario, esEmailValidoEmpresa, esUidValido } = require('../middlewares/db_validator.middlewares')
const { check } = require('express-validator')


const router = Router()

router.get('/', [
    validarJWT,
    validarCampos
], userGet)

router.post('/', [
    check('correo_electronico', 'el correo no es valido').isEmail(),
    check('correo_electronico').custom((correo_electronico) => esEmailValidoUsuario(correo_electronico)),
    check('password_user', 'la contraseña debe tener minimo 6 caracteres').isLength({ min: 6 }),
    validarCampos], userPost)

router.post('/crear_admin', [
    check('correo_electronico', 'el correo no es valido').isEmail(),
    check('correo_electronico', 'el correo no es valido').custom((correo_electronico) => esEmailValidoUsuario(correo_electronico)),
    check('password_user', 'la contraseña debe tener minimo 6 caracteres').isLength({ min: 6 }),
    validarCampos], userAdminPost)

router.put('/:uid', [
    check('uid').custom((uid) => esUidValido(uid)),
    validarJWT,
    validarCampos
], userPut)

router.delete('/:uid', [
    check('uid').custom((uid) => esUidValido(uid)),
    validarJWT,
    esAdminRole,
    validarCampos
], userDelete)

module.exports = router