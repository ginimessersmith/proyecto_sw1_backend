const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/config')
const { v4: uuid } = require('uuid')
const Empresa = require('./empresa.models')
const Lenguas_iso=require('./lenguas_iso.models')
class Usuario extends Model { }

Usuario.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foto_perfil_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rol_user: {
        type:DataTypes.STRING,
        allowNull:false
    },
    estado: {
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    },
    uid_empresa: {
        type: DataTypes.UUID,
        references: {
            model: Empresa,
            key: 'uid'
        }
    },
    uid_lenguas_iso: {
        type: DataTypes.UUID,
        references: {
            model: Lenguas_iso,
            key: 'uid'
        }
    },
    uid_contacto: {
        type: DataTypes.UUID,
        references: {
            model: Usuario,
            key: 'uid'
        }
    }
}, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuario',
    timestamps: false
})

Usuario.belongsTo(Empresa,{foreignKey:'uid_empresa'})
Usuario.belongsTo(Lenguas_iso,{foreignKey:'uid_lenguas_iso'})
Usuario.belongsTo(Usuario,{foreignKey:'uid_contacto'})

module.exports = Usuario