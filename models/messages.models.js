const { DataTypes, Model,Sequelize } = require('sequelize')
const { v4: uuid } = require('uuid')
const { sequelize } = require('../database/config')
const Chat = require('./chat.models')
const Usuario = require('./user.models')


class Messages extends Model { }

Messages.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    mensaje: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    uid_chat: {
        type: DataTypes.UUID,
        references: {
            model: Chat,
            key: 'uid'
        }
    },
    uid_usuario:{
        type: DataTypes.UUID,
        references: {
            model: Usuario,
            key: 'uid'
        }
    },
    audio_url:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    code_639: {
        type: DataTypes.STRING,
        allowNull: false
    },estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
    }, 
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue:DataTypes.NOW
    }, 
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue:Sequelize.fn('now')
    },    
}, {
    sequelize,
    modelName: 'Messages',
    tableName: 'messages',
    timestamps: false
})

Messages.belongsTo(Chat, { foreignKey: 'uid_chat' })
Messages.belongsTo(Usuario, { foreignKey: 'uid_usuario' })

module.exports = Messages