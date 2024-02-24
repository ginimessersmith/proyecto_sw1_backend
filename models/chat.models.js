const { DataTypes, Model } = require('sequelize')
const { v4: uuid } = require('uuid')
const { sequelize } = require('../database/config')
const Usuario = require('./user.models')

class Chat extends Model { }

Chat.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    id_socket: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uid_usuario_emisor: {
        type: DataTypes.UUID,
        references: {
            model: Usuario,
            key: 'uid'
        }
    },
    uid_usuario_receptor: {
        type: DataTypes.UUID,
        references: {
            model: Usuario,
            key: 'uid'
        }
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
    },
}, {
    sequelize,
    modelName: 'Chat',
    tableName: 'chat',
    timestamps: false
})

Chat.belongsTo(Usuario,{foreignKey:'uid_usuario_emisor'})
Chat.belongsTo(Usuario,{foreignKey:'uid_usuario_receptor'})

module.exports=Chat