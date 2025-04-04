import express from 'express'
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  searchItems,
  getSellerItems,
  updateItemStatus,
  createCloudinaryStorage,
  getAllCategories,
  getAllConditions,
} from '../controllers/itemController'

const upload = createCloudinaryStorage()

const router = express.Router()

// GET routes
router.get('/search', searchItems)
router.get('/sellers/:sellerId/items', getSellerItems)
router.get('/', getItems)
router.get('/categories', getAllCategories)
router.get('/conditions', getAllConditions)
router.get('/:id', getItemById)
// POST routes
router.post('/', upload.array('images', 10), createItem)
// PUT routes
router.put('/:id', updateItem)
router.put('/:id/status', updateItemStatus)
// DELETE routes

export default router
