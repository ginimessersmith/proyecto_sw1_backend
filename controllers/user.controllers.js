const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})
const Bitacora = require('../models/bitacora.model')

const { generarToken } = require('../helpers/generarToken.helper')
const Usuario = require('../models/user.models')
const Empresa = require('../models/empresa.models')
const Lenguas_iso = require('../models/lenguas_iso.models')
//? retornar todos los usuarios
const userGet = async (req, res) => {
    try {
        const listaClientes = await Usuario.findAll({where:{rol_user:'CLIENTE'}})
        const filtrar =[]
        for(let cliente of listaClientes){
            const{uid_empresa,uid_lenguas_iso,uid_contacto}=cliente
            const unaEmpresa = await Empresa.findByPk(uid_empresa)
            const unContacto = await Usuario.findByPk(uid_contacto)
            const unIdioma = await Lenguas_iso.findByPk(uid_lenguas_iso)
            const json={
                cliente,
                unaEmpresa,
                unContacto,
                unIdioma
            }

            filtrar.push(json)
        }
        res.json({listaClientes:filtrar})
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al obtener la lista de clientes'
        })
    }
}

//? retornar un usuario por id
const userGetId = async () => {

}

//? crear un usuario
const userPost = async (req, res) => {
    /*
    !REGISTRO DE UN USUARIO
    {
        "fullname":"GINO baptista",
        "correo_electronico":"GINO@gmail.com",
        "password_user":"gino123456",
        "confirmPassword":"gino123456",
        "uid_empresa":"gino123456",
        "uid_lenguas_iso":"gino123456",
        "uid_contacto":"gino123456",
    }
    */
    try {

        const {
            fullname,
            correo_electronico,
            password_user,
            confirmPassword,
            uid_empresa,
            uid_lenguas_iso,
            uid_contacto
        } = req.body

        if ((uid_contacto != undefined && uid_contacto != '') &&
            (uid_empresa != undefined && uid_empresa != '') &&
            (uid_lenguas_iso != undefined && uid_lenguas_iso != '')) {

            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'CLIENTE',
                    uid_empresa,
                    uid_lenguas_iso,
                    uid_contacto
                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        } else if ((!uid_contacto) &&
            (uid_empresa != undefined && uid_empresa != '') &&
            (uid_lenguas_iso != undefined && uid_lenguas_iso != '')) {
            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'CLIENTE',
                    uid_empresa,
                    uid_lenguas_iso,

                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        } else if ((!uid_contacto) &&
            (!uid_empresa) &&
            (uid_lenguas_iso != undefined && uid_lenguas_iso != '')) {
            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'CLIENTE',
                    uid_lenguas_iso,

                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        } else {

            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'CLIENTE',

                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al crear un usuario'
        })
    }



}

const userAdminPost = async (req, res) => {
    /*
    !REGISTRO DE UN USUARIO
    {
        "fullname":"GINO baptista",
        "correo_electronico":"GINO@gmail.com",
        "password_user":"gino123456",
        "confirmPassword":"gino123456",
        "uid_empresa":"gino123456",
        "uid_lenguas_iso":"gino123456",
        "uid_contacto":"gino123456",
    }
    */
    try {

        const {
            fullname,
            correo_electronico,
            password_user,
            confirmPassword,
            uid_empresa,
            uid_lenguas_iso,
            uid_contacto
        } = req.body

        if ((uid_contacto != undefined && uid_contacto != '') &&
            (uid_empresa != undefined && uid_empresa != '') &&
            (uid_lenguas_iso != undefined && uid_lenguas_iso != '')) {

            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'ADMIN',
                    uid_empresa,
                    uid_lenguas_iso,
                    uid_contacto
                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        } else if ((!uid_contacto) &&
            (uid_empresa != undefined && uid_empresa != '') &&
            (uid_lenguas_iso != undefined && uid_lenguas_iso != '')) {
            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'ADMIN',
                    uid_empresa,
                    uid_lenguas_iso,

                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        } else if ((!uid_contacto) &&
            (!uid_empresa) &&
            (uid_lenguas_iso != undefined && uid_lenguas_iso != '')) {
            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'ADMIN',
                    uid_lenguas_iso,

                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        } else {

            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync(password_user, salt)

                const nuevoUsuario = await Usuario.create({
                    fullname,
                    correo_electronico,
                    password_user: encryptPassword,
                    rol_user: 'ADMIN',

                })

                return res.json(nuevoUsuario)
            } else {
                return res.json({ mensaje: 'Las contraseñas no coinciden' })
            }

        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al crear un usuario'
        })
    }



}

//? actualizar un usuario
const userPut = async (req, res) => {
    const {
        fullname,
        correo_electronico,
        password_user,
        confirmPassword,
        uid_empresa,
        uid_lenguas_iso,
        uid_contacto
    } = req.body

    const { uid } = req.params

    try {
       //console.log('archivos: ',req.files)
        const usuario = await Usuario.findByPk(uid)

        if (fullname && fullname != undefined && fullname != '') {
            usuario.fullname = fullname
        }

        if (correo_electronico && correo_electronico != undefined && correo_electronico != '') {
            usuario.correo_electronico = correo_electronico
        }
        //?--------------------------------------CODIGO PARA ACTUALIZAR EL PASSWORD:
        if ((password_user && password_user != undefined && password_user != '') &&
            (confirmPassword && confirmPassword != undefined && confirmPassword != '')) {
            if (password_user == confirmPassword) {
                const salt = bcrypt.genSaltSync()
                usuario.password_user = bcrypt.hashSync(password_user, salt)
            } else {
                return res.status(400).json({
                    mensaje: 'No se puede actualizar al usuario por que las contraseñas no son iguales'
                })
            }
        }
        //?------------------------------------FIN CODIGO PARA ACTUALIZAR EL PASSWORD
        if (uid_empresa && uid_empresa != undefined && uid_empresa != '') {
            const unaEmpresa = await Empresa.findByPk(uid_empresa)
            if (unaEmpresa) {
                usuario.uid_empresa = uid_empresa
            } else {
                return res.status(400).json({
                    mensaje: 'Error al actualizar un usuario, no existe la empresa a actualizar'
                })
            }

        }
        if (uid_lenguas_iso && uid_lenguas_iso != undefined && uid_lenguas_iso != '') {
            const unaLengua = await Lenguas_iso.findByPk(uid_lenguas_iso)
            if (unaLengua) {
                usuario.uid_lenguas_iso = uid_lenguas_iso
            } else {
                return res.status(400).json({
                    mensaje: 'Error al actualizar un usuario, no existe el idioma a actualizar'
                })
            }

        }
        if (uid_contacto && uid_contacto != undefined && uid_contacto != '') {
            const unContacto = await Usuario.findByPk(uid_contacto)
            if (unContacto) {
                usuario.uid_contacto = uid_contacto
            } else {
                return res.status(400).json({
                    mensaje: 'Error al actualizar un usuario, no existe el contacto a actualizar'
                })
            }

        }
        //?--------------------------------------CODIGO AGREGAR UNA FOTO DE PERFIL
        if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {
            //? si viene un archivo
            ///? console.log('archivo:', req.files.archivo)

            if (usuario.foto_perfil_url) {
                const urlArchivo = usuario.foto_perfil_url.split('/')
                const nombre = urlArchivo[urlArchivo.length - 1]
                const [idArchivo, extensionArchivo] = nombre.split('.')
                await cloudinary.uploader.destroy('traductor_ia/' + idArchivo)
            }

            const { tempFilePath } = req.files.archivo
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'traductor_ia' },)
            usuario.foto_perfil_url = secure_url
        }
        //?--------------------------------------FIN AGREGAR UNA FOTO DE PERFIL
        await usuario.save()

        const nuevaBitacora = await Bitacora.create({
            accion: `El usuario actualizo su perfil`,
            uid_usuario: usuario.uid
        })

        res.json({ usuarioActualizado: usuario })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al actualizar usuario'
        })
    }
}

//? eliminar un usuario
const userDelete = async (req, res) => {
    /*
!PRIMERO INICIAR SESION
http://localhost:8080/api/users/{colocar el id}, en el header definir x-token y el values colocar el token
ESTE CONTROLADOR SOLO BANEA AL USUARIO , NO LO ELIMINA DE BASE DE DATOS
*/
    const { uid } = req.params
    try {

        const unUsuario = await Usuario.findByPk(uid)
        unUsuario.estado = false
        await unUsuario.save()
        res.json(unUsuario)

    } catch (error) {

        console.log(error)
        res.status(400).json({
            mensaje: 'Error al crear un usuario'
        })

    }

}

module.exports = {
    userGet,
    userGetId,
    userPost,
    userPut,
    userDelete,
    userAdminPost
}