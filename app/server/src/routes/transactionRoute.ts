import express, { Router } from 'express'
import {
  getSalesSummaryByType,
} from '../controllers/transactionController'
import { validateSellerMiddleware } from '../lib/validateSeller';


const router = Router();

router.get("/:sellerId/total-sale", validateSellerMiddleware, getSalesSummaryByType)

export default router;