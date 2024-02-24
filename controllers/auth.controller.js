
const bcrypt = require('bcryptjs')
const { generarToken } = require('../helpers/generarToken.helper')
const Usuario = require('../models/user.models')
const Empresa = require('../models/empresa.models')



const authLoginPost = async (req, res) => {
    /*
    {
        "correo_electronico":"GINO@gmail.com",
        "password_user":"gino123456"
    }
    */


    const { correo_electronico, password_user } = req.body
    try {
        //! VERIFICAR SI EL CORREO EXISTE
        const usuarioData = await Usuario.findOne({ where: { correo_electronico } })
        const empresaData = await Empresa.findOne({ where: { correo_electronico } })

        if (!usuarioData && !empresaData) {
            return res.status(400).json({
                mensaje: 'error: el correo del usuario o empresa no existe'
            })
        }

        //! VERIFICAR SI EL USUARIO PUEDE INGRESAR, MODIFICAR
        if (usuarioData && !usuarioData.estado) {
            return res.status(400).json({
                mensaje: 'error: el usuario  no esta habilitado para ingresar'
            })
        }

        if (empresaData && !empresaData.estado) {
            return res.status(400).json({
                mensaje: 'error: la empresa no esta habilitado para ingresar'
            })
        }

        //! VERIFICAR LA CONTRASEÑA
        if (usuarioData) {
            const validarPassword = bcrypt.compareSync(password_user, usuarioData.password_user)
            if (!validarPassword) {
                return res.status(400).json({
                    mensaje: 'la contraseña no es correcta'
                })
            }

            const token = await generarToken(usuarioData.uid)
            console.log('ruta auth/login consumida con exito')
            return res.json({
                mensaje: 'Loggin con exito',
                usuarioData,
                token
            })
        } else {
            const validarPassword = bcrypt.compareSync(password_user, empresaData.password_user)
            if (!validarPassword) {
                return res.status(400).json({
                    mensaje: 'la contraseña no es correcta'
                })
            }

            const token = await generarToken(empresaData.uid)
            console.log('ruta auth/login consumida con exito')
            return res.json({
                mensaje: 'Loggin con exito',
                empresaData,
                token
            })

        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            mensaje: 'problemas en auth/login',
            error
        })
    }
}

module.exports = { authLoginPost }