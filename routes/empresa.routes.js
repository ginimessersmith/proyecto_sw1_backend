const { Router } = require("express");
const {
  empresaPost,
  empresaPut,
  empresaGet,
  empresaGetId,
  agregar_cliente_empresa,
  empresaDelete,
} = require("../controllers/empresa.controller");
const {
  esEmailValidoEmpresa,
  esUidValido,
} = require("../middlewares/db_validator.middlewares");
const {
  validarJWT,
  validarCampos,
  esAdminRole,
} = require("../middlewares/exportsMiddlewares");
const { check } = require("express-validator");
const router = Router();

router.post(
  "/",
  [
    check("correo_electronico", "el correo no es valido").isEmail(),
    check("correo_electronico").custom((correo_electronico) =>
      esEmailValidoEmpresa(correo_electronico)
    ),
    check(
      "password_user",
      "la contraseña debe tener minimo 6 caracteres"
    ).isLength({ min: 6 }),
    validarCampos,
  ],
  empresaPost
);

router.put(
  "/:uid",
  [check("uid").custom((uid) => esUidValido(uid)), validarJWT, validarCampos],
  empresaPut
);

router.delete(
  "/:uid",
  [
    check("uid").custom((uid) => esUidValido(uid)),
    validarJWT,
    esAdminRole,
    validarCampos,
  ],
  empresaDelete
);

router.get("/", [validarJWT, validarCampos], empresaGet);

router.get(
  "/:uid",
  [check("uid").custom((uid) => esUidValido(uid)), validarJWT, validarCampos],
  empresaGetId
);

router.post(
  "/agregar_cliente_empresa",
  [
    check("uid_usuario").custom((uid_usuario) => esUidValido(uid_usuario)),
    check("uid_empresa").custom((uid_empresa) => esUidValido(uid_empresa)),
    validarCampos,
  ],
  agregar_cliente_empresa
);

module.exports = router;
