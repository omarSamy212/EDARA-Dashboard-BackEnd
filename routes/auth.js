const router = require("express").Router();
const db = require("../config/database");
// import User table to implement auth
const { User, Warehouse } = require("../models");
//import middleware validator
const {
  isEmail,
  isPassword,
  isUsername,
} = require("../middlewares/auth-validation");
//
const { validationResult } = require("express-validator");
//
const bcrypt = require("bcrypt");
//
const jwt = require("jsonwebtoken");

//Register
router.post("/register", isUsername, isPassword, isEmail, async (req, res) => {
  try {
    //validate result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: errors.array() });
    }

    //validate email
    const data = req.body;
    const user = await User.findOne({
      where: { email: data.email },
    });

    if (user !== null) {
      res.status(400);
      return res.json({ message: "email already exists" });
    }

    // hashed password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(data.password, salt);

    data.password = hashedPass;
    const newUser = await User.create(data);

    // add user to warehouse
if (data.warehouseId) {
  const warehouseId = data.warehouseId;
  const warehouse = await Warehouse.findByPk(warehouseId);
  if (!warehouse) {
    res.status(400);
    return res.json({ message: "warehouse not found" });
  }
  await newUser.addWarehouse(warehouse);
}

res.status(201);
res.json({ message: "user created success" });
  } catch (err) {
    res.status(400);
    res.json({ message: "there is a problem" });
    console.log(err);
  }
});


//Register a new supervisor

router.get("/registerNewSP", async (req, res) => {
  const warehouses = await Warehouse.findAll({
    attributes: ["id", "name"],
  });
  res.status(200);
  res.json({
    warehouses: warehouses,
  });
});

//login
router.post("/login", isPassword, isEmail, async (req, res) => {
  try {
    //validate result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: errors.array() });
    }

    //validate email
    const data = req.body;
    const user = await User.findOne({
      where: { email: data.email },
    });

    if (user == null) {
      res.status(400);
      return res.json({ message: "Email not found" });
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      res.status(400);
      return res.json({ message: "Wrong password" });
    }

    let warehouseId = -1; // Default value if not associated with a warehouse

    if (user.userType === "supervisor") {
      const userWarehouse = await db.query(
        "SELECT warehouseId FROM userwarehouse WHERE userId = :userId",
        {
          replacements: { userId: user.id },
          type: db.QueryTypes.SELECT,
        }
      );

      if (userWarehouse && userWarehouse.length > 0) {
        warehouseId = userWarehouse[0].warehouseId;
      }
    }
    const token = generateAccessToken({
      id: user.id,
      name: user.username,
      email: user.email,
      userType: user.userType,
      warehouseId: warehouseId,
    });

    res.status(200);
    res.json({ token: token });
  } catch (err) {
    res.status(400);
    res.json({ message: "there is a problem" });
    console.log(err);
  }
});

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};


module.exports = router;
