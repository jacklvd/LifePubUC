import express from 'express';
import { createItem } from '../controllers/itemControllers';

const router = express.Router();

router.post("/", createItem);


export default router;