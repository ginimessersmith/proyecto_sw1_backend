const { Router } = require("express");
const { check } = require("express-validator");

const {
    esEmailValidoEmpresa,
    esUidValido,
} = require("../middlewares/db_validator.middlewares");
const {
    validarJWT,
    validarCampos,
    esAdminRole,
} = require("../middlewares/exportsMiddlewares");
const { chatPost, chat_Por_Uid_Usuario, crear_mensaje_agregar_al_chat, enviar_audio, mis_mensajes_otro_usuario,eliminar_chat,eliminar_un_mensaje, mensajes_del_chat, chat_list_uid_usuario, enviar_audio_firebase } = require("../controllers/chat.controller");
const router = Router();

router.post('/', [
    validarJWT,
    check('uid_usuario_emisor').custom((uid_usuario_emisor) => esUidValido(uid_usuario_emisor)),
    check('uid_usuario_receptor').custom((uid_usuario_receptor) => esUidValido(uid_usuario_receptor)),
    validarCampos], chatPost)

router.get('/ver_chats_por_usuario/:uid_usuario', [
    validarJWT,
    check('uid_usuario').custom((uid_usuario) => esUidValido(uid_usuario)),
    validarCampos
], chat_Por_Uid_Usuario)

router.post('/crear_mensaje_agregar_al_chat', [
    validarJWT,
    check('uid_usuario').custom((uid_usuario) => esUidValido(uid_usuario)),
    validarCampos
], crear_mensaje_agregar_al_chat)

router.post('/enviar_audio_chat', [
    validarJWT,
    check('uid_usuario').custom((uid_usuario) => esUidValido(uid_usuario)),
    validarCampos
], enviar_audio)

router.post('/mis_mensajes_otro_usuario', [
    validarJWT,
    check('uid_usuario').custom((uid_usuario) => esUidValido(uid_usuario)),
    check('uid_usuario_destino').custom((uid_usuario_destino) => esUidValido(uid_usuario_destino)),
    validarCampos
], mis_mensajes_otro_usuario)

router.delete('/eliminar_chat/:uid_chat', [
    validarJWT,
    validarCampos
], eliminar_chat)

router.delete('/eliminar_un_mensaje/:uid_mensaje', [
    validarJWT,
    validarCampos
], eliminar_un_mensaje)
//* cambios
router.post('/mensajes_de_un_chat/', [
    validarJWT,
    check('uid_usuario').custom((uid_usuario) => esUidValido(uid_usuario)),
    validarCampos
], mensajes_del_chat)


router.get('/chat_list_uid_usuario/:uid', [
    validarJWT,
    check('uid').custom((uid) => esUidValido(uid)),
    validarCampos
], chat_list_uid_usuario)

router.post('/enviar_audio_firebase', [
    check('uid_usuario').custom((uid_usuario) => esUidValido(uid_usuario)),
    validarCampos
], enviar_audio_firebase)

module.exports = router