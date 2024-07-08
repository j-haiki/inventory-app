const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, "name description");
  res.render("category_list", {
    title: "Category List",
    category_list: categories,
  });
});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).populate("items"),
    Item.find({ category: req.params.id }),
  ]);
  if (category == null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_detail", {
    title: category.name,
    category: category,
    items: items,
  });
});

// Display category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

// Handle category create on POST.
exports.category_create_post = [
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });
      await category.save();
      res.redirect(category.url);
    }
  }),
];

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).populate("items"),
    Item.find({ category: req.params.id }),
  ]);
  if (category == null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    items: items,
  });
});

// Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).populate("items"),
    Item.find({ category: req.params.id }),
  ]);
  if (items.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      items: items,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/inventory/categories");
  }
});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate("items");
  if (category == null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});

// Handle category update on POST.
exports.category_update_post = [
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
      });
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    }
  }),
];
