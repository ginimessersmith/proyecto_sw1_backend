
const { DataTypes, Model,Sequelize } = require('sequelize')
const { sequelize } = require('../database/config')
const { v4: uuid } = require('uuid')
const Usuario = require('./user.models')
const Empresa = require('./empresa.models')


class Bitacora extends Model { }

Bitacora.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    accion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
    },
    uid_usuario: {
        type:DataTypes.UUID,
        references:{
            model:Usuario,
            key:'uid'
        }
    },
    uid_empresa: {
        type:DataTypes.UUID,
        references:{
            model:Empresa,
            key:'uid'
        }
    }
}, {
    sequelize,
    modelName: 'Bitacora',
    tableName: 'bitacora',
    timestamps: false

})

Bitacora.belongsTo(Usuario,{foreignKey:'uid_usuario'})
Bitacora.belongsTo(Empresa,{foreignKey:'uid_empresa'})

module.exports = Bitacora
