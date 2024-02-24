const { Router } = require("express");

const {
  validarJWT,
  validarCampos,
} = require("../middlewares/exportsMiddlewares");
const { reporte_suscripcion } = require("../controllers/reporte.controller");
const router = Router();

router.get("/", [validarJWT, validarCampos], reporte_suscripcion);

module.exports = router;
