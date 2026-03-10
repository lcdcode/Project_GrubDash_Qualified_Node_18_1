const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Validation middleware
function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find(dish => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${dishId}`,
  });
}

function hasName(req, res, next) {
  const { data: { name } = {} } = req.body;
  if (name && name !== "") {
    return next();
  }
  next({ status: 400, message: "Dish must include a name" });
}

function hasDescription(req, res, next) {
  const { data: { description } = {} } = req.body;
  if (description && description !== "") {
    return next();
  }
  next({ status: 400, message: "Dish must include a description" });
}

function hasImageUrl(req, res, next) {
  const { data: { image_url } = {} } = req.body;
  if (image_url && image_url !== "") {
    return next();
  }
  next({ status: 400, message: "Dish must include an image_url" });
}

function hasPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (price !== undefined && price !== null) {
    return next();
  }
  next({ status: 400, message: "Dish must include a price" });
}

function priceIsValid(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (typeof price === "number" && price > 0) {
    return next();
  }
  next({ status: 400, message: "Dish must have a price that is a number greater than 0" });
}

function dishIdMatches(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;
  if (!id || id === "" || id === dishId) {
    return next();
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

// Route handlers
function list(req, res) {
  res.json({ data: dishes });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function update(req, res) {
  const dish = res.locals.dish;
  const { data: { name, description, price, image_url } = {} } = req.body;

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

module.exports = {
  list,
  read: [dishExists, read],
  create: [hasName, hasDescription, hasImageUrl, hasPrice, priceIsValid, create],
  update: [
    dishExists,
    dishIdMatches,
    hasName,
    hasDescription,
    hasImageUrl,
    hasPrice,
    priceIsValid,
    update,
  ],
};
