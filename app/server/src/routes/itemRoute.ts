import express from 'express';
import { createItem } from '../controllers/itemController';

const router = express.Router();

router.post("/", createItem);


export default router;