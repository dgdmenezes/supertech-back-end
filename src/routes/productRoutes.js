import express from "express"
import controllers from "../controllers/productControllers.js"
const  router = express.Router()


//URL/products
router.get("/count", controllers.getCountProducts)
router.get("/find/find?", controllers.productFind)
router.get("/find/count?", controllers.productFindCount)
router.get("/index/index?", controllers.getIndexHome)
router.post("/create", controllers.createProdutct)
router.get("/listautocategory", controllers.categoryAutomaticList)
router.get("/searchbar/find?", controllers.searchBarProductFind)
router.get("/searchbar/count?", controllers.searchBarProductFindCount)
router.get("/:id", controllers.getOne)
router.get("/", controllers.getAllP)

export default router;