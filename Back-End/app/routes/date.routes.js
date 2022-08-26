module.exports = app => {
  const dates = require("../controllers/date.controller.js");

  var router = require("express").Router();

  // Create a new Date
  router.post("/", dates.create);
  
  // Retrieve all Dates
  router.get("/", dates.findAll);

  // Retrieve all published Dates
  router.get("/published", dates.findAllPublished);

  // Retrieve a single Date with id
  router.get("/:id", dates.findOne);

  // Update a Date with id
  router.put("/:id", dates.update);

  // Delete a Date with id
  router.delete("/:id", dates.delete);

  // Delete all Dates
  router.delete("/", dates.deleteAll);

  app.use('/api/dates', router);
};