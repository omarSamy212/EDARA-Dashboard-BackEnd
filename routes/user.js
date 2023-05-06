// API ENDPOINTS (CRUD OPERATIONS)

const router = require("express").Router();
// import User and Warehouse tables to execute CRUD operations
const { Warehouse, User } = require("../models");

// Get all users
router.get("/", async (req, res) => {
  const user = await User.findAll({
    attributes: ["id", "username", "password", "userType"],
  });
  res.status(200);
  res.json(user);
});

// Post new user
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const user = await User.create(data);
    res.status(201);
    res.json({ message: `User is added: user id: ${user.id} ` });
  } catch (err) {
    res.status(400);
    res.json({ message: "there is a problem adding new user" });
  }
});

// Get specific user
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findOne({
//     where: { id: id },
//     attributes: ["id", "username", "userType"],
//   });
//   if (user === null) {
//     res.status(404);
//     res.json({
//       message: "User not found",
//     });
//   } else {
//     res.status(200);
//     res.json(user);
//   }
// });

// Update specific user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await User.findOne({
    where: { id: id },
  });
  if (user === null) {
    res.status(404);
    res.json({
      message: "User not found",
    });
  } else {
    try {
      await User.update(
        { username: data.username },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(200);
      res.json({
        message: "User record is Updated",
      });
    } catch (err) {
      res.status(400);
      res.json({
        message: err.message,
      });
    }
  }
});

// Delete specific user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id: id },
  });
  if (user === null) {
    res.status(404);
    res.json({
      message: "User not found",
    });
  } else {
    await User.destroy({
      where: {
        id: id,
      },
    });
    res.status(200);
    res.json({
      message: "User is Deleted",
    });
  }
});

// JOIN OPERATIONS
// Get specific user with its warehouse info

router.get("/warehouse-info/:id", async (req, res) => {
  const { id } = req.params; // user id

  const user = await User.findOne({
    where: { id: id },
    attributes: ["id", "username"],
    include: {
      model: Warehouse,
      attributes: ["name"],
    },
  });
  if (user === null) {
    res.status(404);
    res.json({
      message: "User not found",
    });
  } else {
    res.status(200);
    res.json(user);
  }
});

// get all users with thier warehouse name
router.get("/sp-wh", async (req, res) => {
  try {
    const users = await User.findAll({
      where: { userType: "supervisor" }, // Filter users with userType = "supervisor"
      attributes: ["id", "username", "email"],
      include: [
        {
          model: Warehouse,
          attributes: ["name"],
          through: { attributes: [] }, // Exclude join table attributes from the result
        },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

// Add new user to specific warehouse

router.post("/add-supervisor-to-warehouse/:id", async (req, res) => {
  const { id } = req.params; // warehouse id
  const data = req.body; // user data
  const wh = await Warehouse.findByPk(id);
  if (wh === null) {
    res.status(400);
    res.json({ message: "Warehouse not found" });
  } else {
    try {
      const user = await wh.createUser(data);
      res.status(201);
      res.json({
        message: `Supervisor is assigned to this warehouse: user id: ${user.id}`,
      });
    } catch (err) {
      console.log("err");
      res.status(400);
      console.log(err);
      res.json({
        message: err.message,
      });
    }
  }
});

// Add new student to a new department

// router.post("/new-department", async (req, res) => {
//   const data = req.body; // data of new student and new department
//   try {
//     const st = await Student.create(data); // create student
//     const dep = await Department.create(data); // create department
//     await st.setDepartment(dep); // connect two tables with foreign key
//     res.status(201);
//     res.json({
//       message: `Student is added in new department: dep id: ${dep.id} and st id ${st.id}`,
//     });
//   } catch (err) {
//     res.status(400);
//     res.json({ message: "there is a problem in creation process" });
//   }
// });

// export
module.exports = router;
