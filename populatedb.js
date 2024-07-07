console.log(
  'This script populates some test items, categories to your database which is specified as argument - e.g.: "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_app?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description, imageUrl) {
  const category = new Category({
    name: name,
    description: description,
    imageUrl: imageUrl,
  });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate({
  index,
  name,
  description,
  category,
  price,
  stock,
  imageUrl,
}) {
  const itemDetail = {
    name: name,
    description: description,
    category: category,
    price: price,
    stock: stock,
    imageUrl: imageUrl,
  };

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(
      0,
      "Electronics",
      "All the latest and greatest.",
      "/images/electronics-c.jpg"
    ),
    categoryCreate(
      1,
      "Clothing",
      "ready for the day.",
      "/images/clothing-c.jpg"
    ),
    categoryCreate(
      2,
      "Furniture",
      "ESTEEMED TO BE THE FURNITURE OF THE FUTURE. We have everything you need to furnish your home.",
      "/images/furniture-c.jpg"
    ),
    categoryCreate(
      3,
      "Groceries",
      "Every person need these items. It's time to shop!",
      "/images/groceries-c.jpg"
    ),
    categoryCreate(
      4,
      "Sports and Outdoor",
      "get your fitness on.",
      "/images/sport_outdoors-c.jpg"
    ),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate({
      index: 0,
      name: "iPhone",
      description: "iPhone 13 Pro Max Silver.",
      category: categories[0],
      price: 699,
      stock: 9,
      imageUrl: "/images/iphone.jpg",
    }),
    itemCreate({
      index: 1,
      name: "Samsung",
      description: "Galaxy S22.",
      category: categories[0],
      price: 1399,
      stock: 4,
      imageUrl: "/images/samsung.jpg",
    }),
    itemCreate({
      index: 2,
      name: "Polo Slim-Fit Denim Jacket.",
      description: "Polo Slim-Fit Denim, this jacket is a wardrobe essential.",
      category: categories[1],
      price: 69,
      stock: 18,
      imageUrl: "/images/jacket.jpg",
    }),
    itemCreate({
      index: 3,
      name: "Tailored Suit",
      description: "Handmade suit, made with high quality materials.",
      category: categories[1],
      price: 20,
      stock: 2,
      imageUrl: "/images/suit.jpg",
    }),
    itemCreate({
      index: 4,
      name: "Herman Miller Ergonomic Chair",
      description:
        "Herman Miller Ergonomic Chair best chair for long sessions.",
      category: categories[2],
      price: 239,
      stock: 5,
      imageUrl: "/images/herman-chair.jpg",
    }),
  ]);
}
