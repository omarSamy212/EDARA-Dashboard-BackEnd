const router = require("express").Router();
const db = require("../config/database");
// import product table to execute CRUD operations
const { Warehouse, Product, StockRequest, User } = require("../models");

// post a new request
router.post("/send-request", async (req, res) => {
  try {
    const Data = req.body;

    // Check if the product exists
    const product = await Product.findByPk(Data.productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Create a new stock request
    const request = await StockRequest.create({
      productId: Data.productId,
      quantity: Data.quantity,
      status: "pending",
      isUsed: false,
      supervisorId: Data.supervisorId,
      requestedQuantity: Data.quantity,
    });

    res.status(201).json({ message: "Request sent successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

// retrive from the stock request table in the admin page
router.get("/pending-requests", async (req, res) => {
    try {
      const query = `
        SELECT 
          requests.id, 
          requests.quantity, 
          requests.supervisorId,
          products.name AS productName,
          products.id AS productId,
          warehouses.name AS warehouseName
        FROM 
          Stock_Requests AS requests
          JOIN Users AS users ON requests.supervisorId = users.id
          JOIN UserWarehouse AS userwarehouse ON users.id = userwarehouse.userId
          JOIN Warehouses AS warehouses ON userwarehouse.warehouseId = warehouses.id
          JOIN Products AS products ON requests.productId = products.id
        WHERE
          requests.status = 'pending'
      `;
  
      const requestsWithWarehouseName = await db.query(query, {
        type: db.QueryTypes.SELECT,
      });
  
      res.status(200).json(requestsWithWarehouseName);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  });

// retrive from the stock request table in the admin page request history
router.get("/all-requests", async (req, res) => {
    try {
      const query = `
      SELECT 
      requests.id, 
      requests.quantity, 
      requests.supervisorId,
      requests.status,
      supervisor.username AS supervisorName,
      products.name AS productName,
      products.id AS productId,
      warehouses.name AS warehouseName,
      warehouses.Id AS warehouseId
    FROM 
      Stock_Requests AS requests
      JOIN Users AS supervisor ON requests.supervisorId = supervisor.id
      JOIN UserWarehouse AS userwarehouse ON supervisor.id = userwarehouse.userId
      JOIN Warehouses AS warehouses ON userwarehouse.warehouseId = warehouses.id
      JOIN Products AS products ON requests.productId = products.id
      `;
  
      const requestsWithWarehouseName = await db.query(query, {
        type: db.QueryTypes.SELECT,
      });
  
      res.status(200).json(requestsWithWarehouseName);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.error(error);
    }
  });

  


// reject a reqeuest
router.put("/reject-request/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = await StockRequest.findOne({
      where: { id: id},
    });

    if (!request) {
      res
        .status(404)
        .json({ message: "Request not found or already processed" });
      return;
    }

    await request.update({ status: "declined", isUsed: "true" });

    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

// approve a reauest
router.put("/approve-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {productId} = req.body 
    // Find the request to be approved
    const request = await StockRequest.findByPk(id);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    
    // Update the product quantity
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Increment the product quantity by the approved quantity
    product.quantity = request.requestedQuantity;
    console.log(request.requestedQuantity);

    // Update the request status to "approved"
    request.status = "approved";
    request.isUsed = true; // Set isUsed to false initially

    // Save the changes
    await request.save();
    await product.save();

    res.status(200).json({ message: "Request approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});




// retrieve on the supervisor page
router.get("/products/:warehouseId", async (req, res) => {
  const { warehouseId } = req.params;

  try {
    // Retrieve all products for the specified warehouse
    const products = await Product.findAll({
      where: { warehouseId },
      attributes: ["id", "name", "quantity", "imageUrl"],
    });

    // // Retrieve corresponding stock requests for the products
    // const stockRequests = await StockRequest.findAll({
    //   where: {
    //     productId: products.map((product) => product.id),
    //     status: "approved",
    //     isUsed: false,
    //   },
    // });

    // // Increment product stock for each available stock request
    // products.forEach((product) => {
    //   const correspondingRequests = stockRequests.filter(
    //     (request) => request.productId === product.id
    //   );
    //   if (correspondingRequests.length > 0) {
    //     product.quantity += correspondingRequests.reduce(
    //       (total, request) => total + request.quantity,
    //       0
    //     );
    //     correspondingRequests.forEach((request) => {
    //       request.used = true;
    //       request.save(); // Save the updated used status in the database
    //     });
    //   }
    // });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

// req history supervisor
router.get("/requests/:supervisorId", async (req, res) => {
  const { supervisorId } = req.params;

  try {
    const requests = await StockRequest.findAll({
      where: { supervisorId: supervisorId },
      include: [
        {
          model: Product,
          attributes: ["name"],
        },
      ],
      attributes: ["id", "quantity", "status"],
    });

    if (requests.length === 0) {
      res.status(404).json({ message: "No requests found for the supervisor" });
    } else {
      res.status(200).json(requests);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

// export
module.exports = router;
