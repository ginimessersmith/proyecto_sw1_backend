const { sequelize } = require("../database/config");
const { Sequelize } = require("sequelize");

const reporte_suscripcion = async (req, res) => {
  const { ini, fin } = req.query;

  try {
    const results = await sequelize.query(
      "SELECT s.uid, nombre_empresa empresa, total_pagado precio, cantidad_usuarios cantidadUsuarios, fecha_inicio fecha  FROM suscripcion s, empresa e WHERE s.uid_empresa = e.uid AND fecha_inicio >= :fecha_inicio AND fecha_fin <= :fecha_fin",
      {
        replacements: { fecha_inicio: ini, fecha_fin: fin },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    res.send(results);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mensaje: "Error al obtener reporte de suscripcion",
    });
  }
};

module.exports = {
  reporte_suscripcion,
};
