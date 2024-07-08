const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");
const item_controller = require("../controllers/itemController");

// GET inventory home page
router.get("/", item_controller.item_list);

// GET create item form
router.get("/item/create", item_controller.item_create_get);

// POST create item
router.post("/item/create", item_controller.item_create_post);

// GET delete item
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST delete item
router.get("/item/:id/delete", item_controller.item_delete_post);

// GET update item
router.get("/item/:id/update", item_controller.item_update_get);

// POST update item
router.get("/item/:id/update", item_controller.item_update_post);

// GET item detail
router.get("/item/:id", item_controller.item_detail);

// GET all items
router.get("/items", item_controller.item_list);

/// CATEGORY ROUTES ///

// GET create category form
router.get("/category/create", category_controller.category_create_get);

// POST create category
router.get("/category/create", category_controller.category_create_post);

// GET delete category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST delete category
router.get("/category/:id/delete", category_controller.category_delete_post);

// GET update category
router.get("/category/:id/update", category_controller.category_update_get);

// POST update category
router.get("/category/:id/update", category_controller.category_update_post);

// GET all categories
router.get("/categories", category_controller.category_list);

// GET category detail
router.get("/category/:id", category_controller.category_detail);

module.exports = router;
