import { Router } from "express";
import MockingController from "../controllers/mocking.controller.js";

const mockingRouter = Router();
const { loadMocking } = new MockingController();

mockingRouter.get("/mockingproducts", loadMocking);

export default mockingRouter;