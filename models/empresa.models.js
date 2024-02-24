const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/config')
const { v4: uuid } = require('uuid')

class Empresa extends Model { }

Empresa.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    nombre_empresa: {
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
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_entidad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    logo_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cantidad_usuarios:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
}, {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresa',
    timestamps: false
})


module.exports = Empresa