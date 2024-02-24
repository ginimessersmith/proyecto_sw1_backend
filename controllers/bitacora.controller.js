const Bitacora = require("../models/bitacora.model")
const Empresa = require("../models/empresa.models")
const Lenguas_iso = require("../models/lenguas_iso.models")
const Usuario = require("../models/user.models")

const bitacoraGet = async (req, res) => {
    try {
        const listaBitacora = await Bitacora.findAll()
        const listaFiltrada = []
        for (let unaBitacora of listaBitacora) {
            const { uid, accion, fecha, hora, uid_usuario } = unaBitacora
            const unUsuario = await Usuario.findOne(
                {
                    where: { uid: uid_usuario },
                    attributes: ['uid',
                        'fullname',
                        'correo_electronico',
                        'foto_perfil_url',
                        'rol_user',
                        'estado',
                        'uid_empresa',
                        'uid_lenguas_iso',
                        'uid_contacto'

                    ]
                })

            const { uid_empresa, uid_lenguas_iso, uid_contacto } = unUsuario
            const unaEmpresa = await Empresa.findOne({
                where: { uid: uid_empresa },
                attributes: ['uid',
                    'nombre_empresa',
                    'correo_electronico',
                    'direccion',
                    'ciudad',
                    'tipo_entidad',
                    'nit',
                    'estado',
                    'logo_url'
                ]
            })
            const unIdioma = await Lenguas_iso.findOne({
                where: { uid: uid_lenguas_iso },
            })

            const response = {
                uid,
                accion,
                fecha,
                hora,
                uid_usuario,
                unUsuario,
                Empresa:unaEmpresa,
                Idioma:unIdioma
            }

            listaFiltrada.push(response)

        }
        res.json({ listaBitacora: listaFiltrada })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'error al obtener los datos de la bitacora'
        })
    }
}

module.exports = { bitacoraGet }