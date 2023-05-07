// API ENDPOINTS (CRUD OPERATIONS)

const router = require("express").Router();
// import product table to execute CRUD operations
const { Warehouse, Product } = require("../models");

// Get all products
// router.get("/", async (req, res) => {
//   const product = await Product.findAll({
//     attributes: ["id", "name", "quantity"],
//   });
//   res.status(200);
//   res.json(product);
// });

// Post new product
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const product = await Product.create(data);
    res.status(201);
    res.json({ message: `Product is created. product id: ${product.id}` });
  } catch (err) {
    res.status(400);
    res.json({ message: "there is a problem creating new product" });
    console.log(err);
  }
});

// fetch all products within a specific warehouse
router.get("/wh-p/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const products = await Product.findAll({
      where: { warehouseId: id },
      attributes: ["id", "name", "quantity","imageUrl"],
    });
    console.log(products);
    if (products.length === 0) {
      
      res.status(404).json({ message: "No products found for the warehouse" });
      
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

// Get specific product
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   const product = await Product.findOne({
//     where: { id: id },
//     attributes: ["id", "name", "quantity"],
//   });
//   if (product === null) {
//     res.status(404);
//     res.json({
//       message: "product not found",
//     });
//   } else {
//     res.status(200);
//     res.json(product);
//   }
// });

// Update specific product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const product = await Product.findOne({
    where: { id: id },
  });
  if (product === null) {
    res.status(404);
    res.json({
      message: "product not found",
    });
  } else {
    try {
      await Product.update(
        { name: data.name, quantity: data.quantity },
        {
          where: {
            id: id,
          },
        }
      );
      res.status(200);
      res.json({
        message: "product is Updated",
      });
    } catch (err) {
      res.status(400);
      res.json({
        message: err.message,
      });
    }
  }
});

// Delete specific product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({
    where: { id: id },
  });
  if (product === null) {
    res.status(404);
    res.json({
      message: "Product not found",
    });
  } else {
    await Product.destroy({
      where: {
        id: id,
      },
    });
    res.status(200);
    res.json({
      message: "Product is Deleted",
    });
  }
});

// Add new product to specific warehouse

router.post("/add-product-to-warehouse/:id", async (req, res) => {
  const { id } = req.params; // warehouse id
  const data = req.body; // product data
  const wh = await Warehouse.findByPk(id);
  if (wh === null) {
    res.status(400);
    res.json({ message: "Warehouse not found" });
  } else {
    try {
      const prod = await wh.createProduct(data);
      res.status(201);
      res.json({
        message: `Product is assigned to this warehouse: prod id: ${prod.id}`,
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

// export
module.exports = router;
