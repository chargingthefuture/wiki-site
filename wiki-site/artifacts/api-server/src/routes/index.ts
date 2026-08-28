import { Router, type IRouter } from "express";
import healthRouter from "./health";
import countRouter from "./count";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(countRouter);
router.use(statsRouter);

export default router;
