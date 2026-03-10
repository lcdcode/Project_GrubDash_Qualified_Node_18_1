const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// Validation middleware
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find(order => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
  });
}

function hasDeliverTo(req, res, next) {
  const { data: { deliverTo } = {} } = req.body;
  if (deliverTo && deliverTo !== "") {
    return next();
  }
  next({ status: 400, message: "Order must include a deliverTo" });
}

function hasMobileNumber(req, res, next) {
  const { data: { mobileNumber } = {} } = req.body;
  if (mobileNumber && mobileNumber !== "") {
    return next();
  }
  next({ status: 400, message: "Order must include a mobileNumber" });
}

function hasDishes(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (dishes) {
    return next();
  }
  next({ status: 400, message: "Order must include a dish" });
}

function dishesIsArray(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (Array.isArray(dishes) && dishes.length > 0) {
    return next();
  }
  next({ status: 400, message: "Order must include at least one dish" });
}

function dishesHaveQuantity(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  const index = dishes.findIndex(
    dish => !dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)
  );
  if (index === -1) {
    return next();
  }
  next({
    status: 400,
    message: `Dish ${index} must have a quantity that is a number greater than 0`,
  });
}

function hasStatus(req, res, next) {
  const { data: { status } = {} } = req.body;
  if (status && status !== "") {
    return next();
  }
  next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
}

function statusIsValid(req, res, next) {
  const { data: { status } = {} } = req.body;
  const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
  if (validStatuses.includes(status)) {
    return next();
  }
  next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
}

function statusIsPending(req, res, next) {
  const { order } = res.locals;
  if (order.status === "pending") {
    return next();
  }
  next({ status: 400, message: "An order cannot be deleted unless it is pending" });
}

function orderIdMatches(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;
  if (!id || id === "" || id === orderId) {
    return next();
  }
  next({
    status: 400,
    message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`,
  });
}

// Route handlers
function list(req, res) {
  res.json({ data: orders });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

function create(req, res) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.dishes = dishes;
  order.status = status;

  res.json({ data: order });
}

function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex(order => order.id === orderId);
  orders.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,
  read: [orderExists, read],
  create: [hasDeliverTo, hasMobileNumber, hasDishes, dishesIsArray, dishesHaveQuantity, create],
  update: [
    orderExists,
    orderIdMatches,
    hasDeliverTo,
    hasMobileNumber,
    hasDishes,
    dishesIsArray,
    dishesHaveQuantity,
    hasStatus,
    statusIsValid,
    update,
  ],
  delete: [orderExists, statusIsPending, destroy],
};
