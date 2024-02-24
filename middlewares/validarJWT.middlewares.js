const jwt = require('jsonwebtoken')
const Usuario = require('../models/user.models')
const Empresa = require('../models/empresa.models')


const validarJWT = async (req, res, next) => {
    const token = req.header('x-token')
    if (!token) {
        return res.status(401).json({
            mensaje: 'Usuario no autorizado, se requiere un token en el header (x-token)'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuarioAutorizado = await Usuario.findByPk(uid)
        const empresaAutorizada = await Empresa.findByPk(uid)

        if (!usuarioAutorizado && !empresaAutorizada) {
            return res.status(401).json({
                mensaje: 'El Usuario o Empresa no existe en la base de datos'
            })
        }
        

        if (usuarioAutorizado && !usuarioAutorizado.estado) {
            return res.status(401).json({
                mensaje: 'El usuario no esta autorizado - estado = false'
            })
        }

        if (empresaAutorizada && !empresaAutorizada.estado) {
            return res.status(401).json({
                mensaje: 'La empresa no esta autorizado - estado = false'
            })
        }
        if(usuarioAutorizado){
            req.usuarioAutorizado = usuarioAutorizado
            next()
        }else{
            req.usuarioAutorizado = empresaAutorizada
            next()
        }
        
    } catch (error) {

        return res.status(401).json({
            mensaje:'Token no valido',
            error
        })

    }
}

module.exports = { validarJWT }