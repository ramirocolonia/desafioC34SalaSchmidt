import { generateProducts } from "../utils.js";

class MockingController{
  loadMocking = (req, res) => {
    try {
      const products = generateProducts();
      res.json({ status: "success", payload: products });
    } catch (error) {
      res.send({ status: "error", message: "Error en ejecución de función generate products con faker, " + error });
    }
  };
}

export default MockingController;