module.exports = (db, type) => {
  return db.define("user", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: type.STRING,
      allowNull: false,
      unique: false,
    },
    email: {
      type: type.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: type.STRING,
      allowNull: false,
    },
    userType: {
      type: type.ENUM("admin", "supervisor"),
      allowNull: false,
      defaultValue: "supervisor",
    },
  });
};
