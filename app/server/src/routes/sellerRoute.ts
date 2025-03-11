import express from 'express'
import { getItemsForSeller } from '../controllers/sellerController'

const router = express.Router()

router.get('/:sellerId/items', getItemsForSeller)
router.get('/:sellerId/items/:itemId')

export default router
