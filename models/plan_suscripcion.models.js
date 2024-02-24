const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/config')
const { v4: uuid } = require('uuid')

class Plan_suscripcion extends Model { }

Plan_suscripcion.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    nombre_plan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio_por_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    periodo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Plan_suscripcion',
    tableName: 'plan_suscripcion',
    timestamps: false
})

module.exports=Plan_suscripcion

