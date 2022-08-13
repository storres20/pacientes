const Category = require("../models/category.model.js");

// Create and Save a new Category
/* exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Category
  const category = new Category({
    //title: req.body.title,
    //description: req.body.description,
    //published: req.body.published || false,
    name: req.body.name
  });

  // Save Category in the database
  Category.create(category, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category."
      });
    else res.send(data);
  });
}; */

// Retrieve all Categories from the database (with condition).
exports.findAll = (req, res) => {
  const title = req.query.title;

  Category.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Categories."
      });
    else res.send(data);
  });
};

// Find a single Category by Id
exports.findOne = (req, res) => {
  Category.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Category with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Category with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};