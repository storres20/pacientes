const sql = require("./db.js");

// constructor
const Date = function(date) {
  this.nombre = date.nombre;
  this.dni = date.dni;
  this.fechacita = date.fechacita;
  this.fechacita2 = date.fechacita2;
  this.hora = date.hora;
  this.categoria2 = date.categoria2;
};

Date.create = (newDate, result) => {
  sql.query("INSERT INTO cita SET ?", newDate, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created date: ", { id: res.insertId, ...newDate });
    result(null, { id: res.insertId, ...newDate });
  });
};

Date.findById = (id, result) => {
  sql.query(`SELECT * FROM operacion WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found product: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Product with the id
    result({ kind: "not_found" }, null);
  });
};


Date.getAll = (title, result) => {
  let query = "SELECT * FROM operacion ORDER BY fecha2";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("products: ", res);
    result(null, res);
  });
};

Date.getAllPublished = result => {
  sql.query("SELECT * FROM products WHERE published=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("products: ", res);
    result(null, res);
  });
};

Date.updateById = (id, product, result) => {
  sql.query(
    //"UPDATE products SET title = ?, description = ?, model = ?, quantity = ?, published = ?, warranty = ?, price = ? WHERE id = ?",
    //[product.title, product.description, product.model, product.quantity, product.warranty, product.price, id],
    `UPDATE operacion SET nombre = '${product.nombre}', dni = '${product.dni}', fecha = '${product.fecha}', fecha2 = '${product.fecha2}', tipo = '${product.tipo}', categoria = '${product.categoria}' WHERE id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Product with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated product: ", { id: id, ...product });
      result(null, { id: id, ...product });
    }
  );
};

Date.remove = (id, result) => {
  sql.query("DELETE FROM operacion WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted product with id: ", id);
    result(null, res);
  });
};

Date.removeAll = result => {
  sql.query("DELETE FROM products", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} products`);
    result(null, res);
  });
};

module.exports = Date;
