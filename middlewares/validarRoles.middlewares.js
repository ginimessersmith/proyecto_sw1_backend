const { request: req, response: res } = require('express')

const esAdminRole = (req, res, next) => {

    if (!req.usuarioAutorizado) {
        return res.status(500).json({
            mensaje: 'esAdminRole se esta ejecuatando antes de la validacion del token (validarJWT)'
        })
    }

    const { rol_user, fullname, correo_electronico } = req.usuarioAutorizado

    if (rol_user != 'ADMIN') {
        return res.status(500).json({
            mensaje: `el usuario de nombre: ${fullname}, correo: ${correo_electronico}, no es un administrador`,
           
        })
    }

    next()

}



module.exports={esAdminRole}