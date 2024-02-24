const validarCampos=require('./validarCampos.middlewares')
const validarJWT=require('./validarJWT.middlewares')
const validarRoles=require('./validarRoles.middlewares')

module.exports={
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}
