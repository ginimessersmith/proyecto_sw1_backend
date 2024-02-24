const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../database/config')
const { v4: uuid } = require('uuid')
const Empresa = require('./empresa.models')
const Plan_suscripcion = require('./plan_suscripcion.models')

class Suscripcion extends Model { }

Suscripcion.init({
    uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid()
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    uid_plan_suscripcion: {
        type: DataTypes.UUID,
        references: {
            model: Plan_suscripcion,
            key: 'uid'
        }
    },
    uid_empresa: {
        type: DataTypes.UUID,
        references: {
            model: Empresa,
            key: 'uid'
        }
    },
    total_pagado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Suscripcion',
    tableName: 'suscripcion',
    timestamps: false
})
Suscripcion.belongsTo(Plan_suscripcion,{foreignKey:'uid_plan_suscripcion'})
Suscripcion.belongsTo(Empresa,{foreignKey:'uid_empresa'})

module.exports = Suscripcion
