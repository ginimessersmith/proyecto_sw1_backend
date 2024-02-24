const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/config')
const { v4: uuid } = require('uuid')



class Lenguas_iso extends Model { }

Lenguas_iso.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    iso_language: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    code_639: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Lenguas_iso',
    tableName: 'lenguas_iso',
    timestamps: false
})

module.exports = Lenguas_iso