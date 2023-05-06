const router = require("express").Router();
const { Warehouse } = require("../models");


// Get all warehouses
router.get("/", async (req, res) => {
  const warehouses = await Warehouse.findAll();
  res.status(200);
  res.json(warehouses);
});

// Create new warehouse
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const warehouse = await Warehouse.create(data);
    res.status(201);
    res.json({ message: `Warehouse created. Warehouse id: ${warehouse.id}` });
  } catch (err) {
    res.status(400);
    res.json({ message: "Error creating warehouse." });
    console.log(err);
  }
});

// Get specific warehouse by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const warehouse = await Warehouse.findOne({ where: { id } });
  if (warehouse === null) {
    res.status(404);
    res.json({ message: "Warehouse not found." });
  } else {
    res.status(200);
    res.json(warehouse);
  }
});

// Update specific warehouse by id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const warehouse = await Warehouse.findOne({ where: { id } });
  if (warehouse === null) {
    res.status(404);
    res.json({ message: "Warehouse not found." });
  } else {
    try {
      await Warehouse.update(data, { where: { id } });
      res.status(200);
      res.json({ message: "Warehouse updated." });
    } catch (err) {
      res.status(400);
      res.json({ message: "Error updating warehouse." });
      console.log(err);
    }
  }
});

// Delete specific warehouse by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const warehouse = await Warehouse.findOne({ where: { id } });
  if (warehouse === null) {
    res.status(404);
    res.json({ message: "Warehouse not found." });
  } else {
    try {
      await Warehouse.destroy({ where: { id } });
      res.status(200);
      res.json({ message: "Warehouse deleted." });
    } catch (err) {
      res.status(400);
      res.json({ message: "Error deleting warehouse." });
      console.log(err);
    }
  }
});

module.exports = router;
