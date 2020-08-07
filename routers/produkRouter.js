const router = require('express').Router()

const { produkController } = require('../controllers')

router.get('/produk/get', produkController.getProducts)
router.get('/produk/get/:id', produkController.getProductById)
router.post('/produk/add', produkController.addProduct)
router.patch('/produk/edit/:id', produkController.editProduct)
router.delete('/produk/delete/:id', produkController.deleteProduct)
router.get('/produk/get/page/:limit/:page', produkController.getProductByPagination)

module.exports = router