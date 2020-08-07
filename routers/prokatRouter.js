const router = require('express').Router()

const { prokatController } = require('../controllers')

router.get('/produk-kategori/get', prokatController.getProductCategory)
router.get('/produk-kategori/get/:id', prokatController.getProcatById)
router.post('/produk-kategori/add', prokatController.addProcat)
router.delete('/produk-kategori/delete/:id', prokatController.deleteProkat)
router.patch('/produk-kategori/edit/:id', prokatController.editProkat)

module.exports = router