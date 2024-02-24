const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const Bitacora = require("../models/bitacora.model");

const Empresa = require("../models/empresa.models");
const Usuario = require("../models/user.models");

const empresaPost = async (req, res) => {
  /*
    !REGISTRO DE UNA EMPRESA
    {
        "nombre_empresa":"Unagro",
        "correo_electronico":"GINO@gmail.com",
        "password_user":"gino123456",
        "confirmPassword":"gino123456",
        "direccion":"Av. Las America",
        "ciudad":"Santa Cruz de la Sierra",
        "tipo_entidad":"Sociedad Anonima",
        "nit":"12345678",
        "cantidad_usuarios":20,
    }
    */
  const {
    nombre_empresa,
    correo_electronico,
    password_user,
    confirmPassword,
    direccion,
    ciudad,
    tipo_entidad,
    nit,
    cantidad_usuarios
  } = req.body;

  try {
    if (password_user == confirmPassword) {
      const salt = bcrypt.genSaltSync();
      const encryptPassword = bcrypt.hashSync(password_user, salt);

      if (cantidad_usuarios) {
        const nuevaEmpresa = await Empresa.create({
          nombre_empresa,
          correo_electronico,
          password_user: encryptPassword,
          direccion,
          ciudad,
          tipo_entidad,
          nit,
          rol_user: "EMPRESA",
          cantidad_usuarios
        })
        await Bitacora.create({
          accion: `La empresa se ha registrado`,
          uid_empresa: nuevaEmpresa.uid,
        });

        res.json({
          mensaje: "Empresa creada",
          nuevaEmpresa,
        })
      } else {

        const nuevaEmpresa = await Empresa.create({
          nombre_empresa,
          correo_electronico,
          password_user: encryptPassword,
          direccion,
          ciudad,
          tipo_entidad,
          nit,
          rol_user: "EMPRESA",
        })

        await Bitacora.create({
          accion: `La empresa se ha registrado`,
          uid_empresa: nuevaEmpresa.uid,
        })

        res.json({
          mensaje: "Empresa creada",
          nuevaEmpresa,
        })
      }



    } else {
      return res.json({ mensaje: "Las contraseñas no coinciden" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mensaje: "Error al crear una empresa",
    });
  }
};
const empresaPut = async (req, res) => {
  const { uid } = req.params;
  const {
    nombre_empresa,
    correo_electronico,
    password_user,
    confirmPassword,
    direccion,
    ciudad,
    tipo_entidad,
    nit,
    cantidad_usuarios
  } = req.body;

  try {
    //console.log('archivos: ',req.files)
    const empresa = await Empresa.findByPk(uid);

    if (nombre_empresa && nombre_empresa != undefined && nombre_empresa != "") {
      empresa.nombre_empresa = nombre_empresa;
    }

    if (
      correo_electronico &&
      correo_electronico != undefined &&
      correo_electronico != ""
    ) {
      empresa.correo_electronico = correo_electronico;
    }

    //?--------------------------------------CODIGO PARA ACTUALIZAR EL PASSWORD:
    if (
      password_user &&
      password_user != undefined &&
      password_user != "" &&
      confirmPassword &&
      confirmPassword != undefined &&
      confirmPassword != ""
    ) {
      if (password_user == confirmPassword) {
        const salt = bcrypt.genSaltSync();
        empresa.password_user = bcrypt.hashSync(password_user, salt);
      } else {
        return res.status(400).json({
          mensaje:
            "No se puede actualizar a la empresa por que las contraseñas no son iguales",
        });
      }
    }
    //?------------------------------------FIN CODIGO PARA ACTUALIZAR EL PASSWORD

    if (direccion && direccion != undefined && direccion != "") {
      empresa.direccion = direccion;
    }

    if (ciudad && ciudad != undefined && ciudad != "") {
      empresa.ciudad = ciudad;
    }

    if (tipo_entidad && tipo_entidad != undefined && tipo_entidad != "") {
      empresa.tipo_entidad = tipo_entidad;
    }

    if (nit && nit != undefined) {
      empresa.nit = nit;
    }

    if (cantidad_usuarios && cantidad_usuarios != undefined && cantidad_usuarios != "") {
      empresa.cantidad_usuarios = cantidad_usuarios;
    }

    //?--------------------------------------CODIGO AGREGAR UNA FOTO DE PERFIL
    if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {
      //? si viene un archivo
      ///? console.log('archivo:', req.files.archivo)

      if (empresa.logo_url) {
        const urlArchivo = empresa.logo_url.split("/");
        const nombre = urlArchivo[urlArchivo.length - 1];
        const [idArchivo, extensionArchivo] = nombre.split(".");
        await cloudinary.uploader.destroy("traductor_ia/" + idArchivo);
      }

      const { tempFilePath } = req.files.archivo;
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        folder: "traductor_ia",
      });
      empresa.logo_url = secure_url;
    }
    //?--------------------------------------FIN AGREGAR UNA FOTO DE PERFIL
    await empresa.save();

    await Bitacora.create({
      accion: `La empresa actualizo su perfil`,
      uid_empresa: empresa.uid,
    });

    res.json({ empresaActualizada: empresa });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mensaje: "Error al actualizar empresa",
    });
  }
};

const empresaGet = async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    const filtrar = []

    for (let unaEmpresa of empresas) {
      const { uid: uid_empresa } = unaEmpresa
      const listaClientes = await Usuario.findAll({
        where: { uid_empresa },
        attributes: [
          'uid',
          'fullname',
          'correo_electronico',
          'foto_perfil_url']
      })
      
      const json = {
        Empresa: unaEmpresa,
        listaClientes
      }
      filtrar.push(json)
    }

    res.json({ lista_empresas: filtrar });
  } catch (error) {
    console.log("empresa--get: " + error);
    res.status(400).json({
      mensaje: "Error al obtener lista de empresas",
    });
  }
};

const empresaGetId = async (req, res) => {
  const { uid } = req.params;
  try {
    const empresa = await Empresa.findByPk(uid);
    res.send(empresa);
  } catch (error) {
    console.log("empresa--get-id: " + error);
    res.status(400).json({
      mensaje: "Error al obtener info de la empresa solicitada",
    });
  }
};

const empresaDelete = async (req, res) => {
  const { uid } = req.params;
  try {
    const empresa = await Empresa.findByPk(uid);
    empresa.estado = false;
    await empresa.save();
    const listaClientes = await Usuario.findAll({ where: { uid_empresa: uid } })

    for (let cliente of listaClientes) {
      const { uid: uid_usuario } = cliente
      const unCliente = await Usuario.findByPk(uid_usuario)
      unCliente.estado = false
      await unCliente.save()
    }

    await Bitacora.create({
      accion: `La empresa ha eliminado su cuenta`,
      uid_empresa: empresa.uid,
    });
    res.json(empresa);
  } catch (error) {
    console.log("empressa delete: " + error);
    res.status(400).json({
      mensaje: "Error al eliminar empresa",
    });
  }
};

const agregar_cliente_empresa = async (req, res) => {
  const { uid_usuario, uid_empresa } = req.body

  try {


    const unCliente = await Usuario.findByPk(uid_usuario)
    const unaEmpresa = await Empresa.findByPk(uid_empresa)

    if (unCliente.rol_user == 'CLIENTE' && unCliente.uid_empresa == null) {

      unCliente.uid_empresa = uid_empresa
      unaEmpresa.cantidad_usuarios = unaEmpresa.cantidad_usuarios + 1

      await unaEmpresa.save()
      await unCliente.save()
      await Bitacora.create({
        accion: `La empresa agrego un nuevo cliente`,
        uid_empresa: unaEmpresa.uid,
      })

      return res.json(unCliente)



    } else {

      return res.status(400).json({
        mensaje: "El usuario no es un cliente o ya es miembro de una empresa",
      })

    }

  } catch (error) {
    console.log(error)
    res.status(400).json({
      mensaje: "Error al agregar un cliente a una empresa",
    })
  }
}

module.exports = {
  empresaPost,
  empresaPut,
  empresaGet,
  empresaGetId,
  empresaDelete,
  agregar_cliente_empresa,
};
