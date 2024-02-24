//! esto es una prueba
const { Router } = require('express')
const { audioPost } = require('../controllers/audio.controller')
const router = Router()


router.post('/', audioPost)

module.exports = router