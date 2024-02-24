const Empresa = require("../models/empresa.models");
const Usuario = require("../models/user.models");

const esEmailValidoUsuario = async (correo_electronico = '') => {
    const existeEmail = await Usuario.findOne({ where: { correo_electronico } })
    if (existeEmail) {
        throw new Error(`el siguiente email: ${correo_electronico} , ya esta registrado en la BD`)
    }
}

const esEmailValidoEmpresa = async(correo_electronico = '')=>{
    const existeEmail = await Empresa.findOne({ where: { correo_electronico } })
    if (existeEmail) {
        throw new Error(`el siguiente email: ${correo_electronico} , ya esta registrado en la BD`)
    }
}

const esUidValido = async(uid='')=>{
    const unUsuario = await Usuario.findByPk(uid)
    const unaEmpresa = await Empresa.findByPk(uid)

    if(!unUsuario && !unaEmpresa){
        throw new Error(`el Usuario o Empresa no existe en la BD`)
    }
}

module.exports={
    esEmailValidoEmpresa,
    esEmailValidoUsuario,
    esUidValido
}