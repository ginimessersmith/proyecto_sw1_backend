
const Lenguas_iso = require("../models/lenguas_iso.models");

const lenguasPost = async (req, res) => {
    const { iso_language, code_639 } = req.body
    try {
        if ((iso_language != undefined && code_639 != undefined) &&
            (iso_language != '' && code_639 != '')) {
            const nuevaLengua = await Lenguas_iso.create({
                iso_language,
                code_639
            })
            return res.json({ nuevaLengua })
        } else {
            return res.status(400).json({
                mensaje: 'Error, deben venir de manera obligatoria : iso_language y code_639 '
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al crear un idioma Iso'
        })
    }
}
const lenguasPut = async (req, res) => {

}

const lenguasGet = async (req, res) => {
    try {

        const listaIdiomas = await Lenguas_iso.findAll()
        res.json(listaIdiomas)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error obtener todos los idioma Iso'
        })
    }
}

const lenguasGetId = async (req, res) => { }

const lenguasDelete = async (req, res) => {
    const { uid } = req.params
    try {
        const idiomaEliminar = await Lenguas_iso.findByPk(uid)
        if (idiomaEliminar) {
            await idiomaEliminar.destroy()
            return res.json({mensaje:'idioma eliminado con exito',idiomaEliminar})
        } else {
            return res.status(400).json({
                mensaje: 'no existe el idioma a eliminar'
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al eliminar un idioma Iso'
        })
    }
}

module.exports = {
    lenguasPost,
    lenguasPut,
    lenguasGetId,
    lenguasGet,
    lenguasDelete
}