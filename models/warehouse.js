// Warehouse Model (function)
// Will be converted to a table named "warehouse" in the db and has id, name, location, imageUrl columns

module.exports = (db, type) => {
  return db.define("warehouse", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false
    },
    location: {
      type: type.STRING,
      allowNull: false
    },
    imageUrl: {
      type: type.STRING,
      allowNull: true // image is optional, so it can be null
    }
  });
};
