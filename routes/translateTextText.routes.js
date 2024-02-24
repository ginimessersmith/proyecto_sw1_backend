const { Router } = require('express')
const {traducirTextoTextoPost} = require('../controllers/translateTextText.controller')

const {validarCampos, validarJWT} = require('../middlewares/exportsMiddlewares')
const router = Router()


router.post('/',[
    validarJWT,
    validarCampos], traducirTextoTextoPost)


module.exports = router