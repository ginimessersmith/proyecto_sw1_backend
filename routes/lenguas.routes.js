const { Router } = require('express')
const router = Router()
const { lenguasPost, lenguasGet, lenguasGetId, lenguasPut, lenguasDelete } = require('../controllers/lenguajes.controller')

router.post('/', lenguasPost)
router.get('/', lenguasGet)
router.get('/:uid', lenguasGetId)
router.put('/', lenguasPut)
router.delete('/:uid', lenguasDelete)

module.exports = router