import express from "express";
import match from "./match";
import resolve from "./resolve";

const router = express.Router();

router.use('/match', match);
router.use('/resolve', resolve);

export default router;