import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

const productsRouter = Router();
const {
  loadProducts,
  loadProduct,
  newProduct,
  updateProduct,
  deleteProduct
} = new ProductController();

productsRouter.get("/", loadProducts);
productsRouter.get("/:pid", loadProduct);
productsRouter.post("/", newProduct);
productsRouter.put("/:pid", updateProduct);
productsRouter.delete("/:pid", deleteProduct);

export default productsRouter;