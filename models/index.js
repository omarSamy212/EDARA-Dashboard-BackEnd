const Sequelize = require("sequelize");
const db = require("../config/database");

// import (models functions)
const ProductModel = require("./product");
const WarehouseModel = require("./warehouse");
const UserModel = require("./user");
const StockRequestModel = require("./stockrequest");

// convert models to tables (calling models functions)
const Product = ProductModel(db, Sequelize);
const Warehouse = WarehouseModel(db, Sequelize);
const User = UserModel(db, Sequelize);
const StockRequest = StockRequestModel(db, Sequelize);

// Define relationships between models
// Define relationships between models
User.belongsToMany(Warehouse, {
  through: 'UserWarehouse',
  foreignKey: "userId",
  otherKey: "warehouseId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Warehouse.belongsToMany(User, {
  through: 'UserWarehouse',
  foreignKey: "warehouseId",
  otherKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



StockRequest.belongsTo(User, {
  as: "supervisor",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
User.hasMany(StockRequest, {
  foreignKey: "supervisorId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

StockRequest.belongsTo(Product, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.hasMany(StockRequest, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(Warehouse, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Warehouse.hasMany(Product, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// convert models to tables
// force:false => if tables are not created, create these tables
// make force:true => when you need to drop this schema and build it again
db.sync({ force: false }).then(() => {
  console.log("Tables Created!");
});

// export tables
module.exports = {
  Product,
  Warehouse,
  User,
  StockRequest,
};

// const Sequelize = require("sequelize");
// const db = require("../config/database");

// // import (models functions)
// const ProductModel = require("./product");
// const WarehouseModel = require("./warehouse");
// const UserModel = require("./user");

// // convert models to tables (calling models functions)
// const Product = ProductModel(db, Sequelize);
// const Warehouse = WarehouseModel(db, Sequelize);
// const User = UserModel(db, Sequelize);

// // Define relationships between models
// User.belongsTo(Warehouse, {
//   foreignKey: "warehouseId",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });
// Warehouse.hasOne(User, {
//   foreignKey: {
//     name: "warehouseId",
//     allowNull: true,
//   },
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

// User.belongsToMany(Product, {
//   through: "StockRequest",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });
// Product.belongsToMany(User, {
//   through: "StockRequest",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

// Product.belongsTo(Warehouse, {
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });
// Warehouse.hasMany(Product, {
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

// // convert models to tables
// // force:false => if tables are not created, create these tables
// // make force:true => when you need to drop this schema and build it again
// db.sync({ force: false }).then(() => {
//   console.log("Tables Created!");
// });

// // export tables
// module.exports = {
//   Product,
//   Warehouse,
//   User,
// };
