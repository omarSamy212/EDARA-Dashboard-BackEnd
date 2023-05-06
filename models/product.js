// Product Model (function)
// Will be converted to a table named "product" in the db and has id, name, quantity, imageUrl columns

module.exports = (db, type) => {
  return db.define("product", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    quantity: {
      type: type.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: type.STRING,
      allowNull: true,
    },
  });
};
