import express from "express";
import {applyBonusController } from "./bonus.controller.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.post("/apply", authorize("OWNER"), applyBonusController);


export default router;


