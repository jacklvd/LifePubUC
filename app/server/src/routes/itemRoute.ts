import express from 'express'
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
  updateItemStatus,
  createCloudinaryStorage,
} from '../controllers/itemController'

const upload = createCloudinaryStorage()

const router = express.Router()

// GET routes
router.get('/search', searchItems)
router.get('/', getItems)
router.get('/:id', getItemById)
// POST routes
router.post('/', upload.array('images', 10), createItem)
// PUT routes
router.put('/:id', updateItem)
router.put('/:id/status', updateItemStatus)
// DELETE routes
router.delete('/:id', deleteItem)

export default router
