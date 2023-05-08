module.exports = (db, type) => {
  return db.define("Stock_Request", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: type.INTEGER,
      allowNull: false,
    },
    requestedQuantity: {
      type: type.INTEGER,
      allowNull: false,
    },
    status: {
      type: type.ENUM("pending", "approved", "declined"),
      allowNull: false,
      defaultValue: "pending",
    },
    isUsed: {
      type: type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
