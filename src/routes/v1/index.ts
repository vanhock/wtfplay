import express from "express";
import match from "./match";
import players from "./players";

const router = express.Router();

router.use('/match', match);

router.use('/players', players);

export default router;