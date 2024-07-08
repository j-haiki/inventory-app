const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find({}, "name description");
  res.render("item_list", {
    title: "Item List",
    item_list: items,
  });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const [item, category] = await Promise.all([
    Item.findById(req.params.id).populate("category"),
    Category.findById(req.params.id),
  ]);
  if (item == null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_detail", {
    title: item.name,
    item: item,
    category: category,
  });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  // get all items
  const categories = await Category.find({}, "name description");
  res.render("item_form", {
    title: "Create Item",
    categories: categories,
  });
});

// Handle item create on POST.
exports.item_create_post = [
  body("name", "Item name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price required").trim().isLength({ min: 1 }).escape(),
  body("stock", "Stock required").trim().isLength({ min: 1 }).escape(),
  body("imageUrl", "Image URL required").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await Category.find({}, "name description");
      res.render("item_form", {
        title: "Create Item",
        categories: categories,
        item: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        imageUrl: req.body.imageUrl,
      });
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const [item, category] = await Promise.all([
    Item.findById(req.params.id).populate("category"),
    Category.findById(req.params.id),
  ]);
  if (item == null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_delete", {
    title: "Delete Item",
    item: item,
    category: category,
  });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const [item, category] = await Promise.all([
    Item.findById(req.body.itemid).populate("category"),
    Category.findById(req.body.categoryid),
  ]);
  if (item == null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/inventory/items");
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, category] = await Promise.all([
    Item.findById(req.params.id).populate("category"),
    Category.findById(req.params.id),
  ]);
  if (item == null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  res.render("item_form", {
    title: "Update Item",
    item: item,
    category: category,
  });
});

// Handle item update on POST.
exports.item_update_post = [
  body("name", "Item name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price required").trim().isLength({ min: 1 }).escape(),
  body("stock", "Stock required").trim().isLength({ min: 1 }).escape(),
  body("imageUrl", "Image URL required").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [item, category] = await Promise.all([
        Item.findById(req.params.id).populate("category"),
        Category.findById(req.params.id),
      ]);
      if (item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_form", {
        title: "Update Item",
        item: item,
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        imageUrl: req.body.imageUrl,
        _id: req.params.id,
      });
      await Item.findByIdAndUpdate(req.params.id, item);
      res.redirect(item.url);
    }
  }),
];
