import express from 'express'
import {
    getItemsForSeller,
    deleteItemForSeller
} from '../controllers/sellerController'

import { validateSellerMiddleware } from '../lib/validateSeller';

const router = express.Router(); 

router.get("/:sellerId/items", validateSellerMiddleware, getItemsForSeller)
router.get("/:sellerId/items/:itemId",)
// DELETE
router.delete("/:sellerId/items/:itemId", validateSellerMiddleware, deleteItemForSeller)

export default router;