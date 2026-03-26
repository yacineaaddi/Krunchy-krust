import { requireAdmin } from "../middlware/requireAdmin.js";
import { requireDriver } from "../middlware/requireDriver.js";
import { StoreHours } from "../models/Hours.model.js";
import { upload } from "../middlware/multerConfig.js";
import { StoreMenu } from "../models/Menu.model.js";
import { NewOrder } from "../models/Order.model.js";
import { User } from "../models/User.model.js";
import { protect } from "../middlware/auth.js";
import { io } from "../server.js";
import jwt from "jsonwebtoken";
import express from "express";
import axios from "axios";

const router = express.Router();

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REF_JWT_EXPIRES_IN,
  });
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
router.get("/menu", async (req, res) => {
  const menu = await StoreMenu.findOne();
  if (!menu) {
    return res.json([]);
  }
  res.json(menu.items);
});
//Route for editing store menu - Admin
router.post("/admin/menu", protect, requireAdmin, async (req, res) => {
  try {
    const menu = await StoreMenu.findOneAndUpdate(
      {},
      { items: req.body },
      { new: true, upsert: true },
    );
    //io.emit("order:updateMenu", menu.items);
    //io.to("admin").emit("menu:update", menu.items);
    io.emit("order:updateMenu", menu.items);
    res.json(menu.items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Route for registring driver and admin * change role before register
/*router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, password, role: "admin" });

    const raw = await User.findById(user._id).lean();
    //const token = generateToken(user._id, user.role);
    res.status(201).json({ id: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/
//Route for login - Driver
router.post("/login/driver", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({
      username,
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    if (user.role !== "driver") {
      return res.status(403).json({
        message: "Access denied. This login is for drivers only.",
      });
    }
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("accessToken", accessToken, {
        //secure: false, // important for localhost
        //sameSite: "lax", // works with localhost ports
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        //secure: false, // important for localhost
        //sameSite: "lax", // works with localhost ports
        httpOnly: true,
        path: "/refresh",
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        id: user._id,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Route for login - Admin
router.post("/login/admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({
      username,
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. This login is for admin only.",
      });
    }
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("accessToken", accessToken, {
        //secure: false, // important for localhost
        //sameSite: "lax", // works with localhost ports
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        //secure: false, // important for localhost
        //sameSite: "lax", // works with localhost ports
        httpOnly: true,
        path: "/refresh",
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        id: user._id,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Route for retrieving (req.user) - Admin and Driver
router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});
//Route for refresh token - Admin and Driver
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      //return res.status(401).json({ message: "No user found" });
      return res.status(401).json({ message: "No user found" });
    }
    if (user.refreshToken !== refreshToken) return res.status(403);

    const newAccessToken = generateToken(user);

    res
      .cookie("accessToken", newAccessToken, {
        //secure: false, //important for localhost
        //sameSite: "lax", // works with localhost ports
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});
//Route for saving new order - User
router.post("/neworder", async (req, res) => {
  const { latitude, longitude } = req.body.location;
  try {
    const orderId = Math.floor(1000 + Math.random() * 9000); // generates 1000–9999

    const newOrder = new NewOrder({
      orderId,
      guestId: req.guestId,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,

      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      Order: req.body.Order,
      prep_time: req.body.prep_time,
    });

    const newKrunchy = await newOrder.save();

    io.to("admin").emit("order:add", newKrunchy);

    res.status(200).json(newKrunchy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Route for fetching orders - User
router.post("/myorders", async (req, res) => {
  try {
    const { trackedIds } = req.body;
    const orders = await NewOrder.find({
      _id: { $in: trackedIds },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// I think this route is never used
router.get("/orders", protect, async (req, res) => {
  try {
    const Orders = await NewOrder.find();
    res.json(Orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Route for state transition - Admin
router.put(
  "/:orderId/admin-transition",
  protect,
  requireAdmin,
  async (req, res) => {
    const { orderId } = req.params;
    const { action, reject_message } = req.body.payload;
    try {
      const order = await NewOrder.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const transitions = ["PLACED", "CONFIRMED", "READY"];

      if (action === "REJECTED") {
        try {
          order.status = action;
          order.reject_message = reject_message;
          await order.save();

          io.to(`order:${order._id}`).emit("order:update", order);
          setTimeout(
            async () => {
              await NewOrder.findByIdAndDelete(orderId);

              io.to(`order:${orderId}`).emit("order:delete", orderId);
              io.to("admin").emit("order:delete", orderId);
            },
            5 * 60 * 1000,
          );

          return res.status(200).json(order);
        } catch (err) {
          console.error("Error:", err);
          return res.status(500).json({ message: err.message });
        }
      }

      const currentIndex = transitions.indexOf(order.status);
      const nextIndex = transitions.indexOf(action);

      if (currentIndex === -1 || nextIndex === -1) {
        return res.status(400).json({ message: "Invalid status" });
      }

      if (nextIndex !== currentIndex + 1 || order.status?.includes(action)) {
        return res.status(400).json({
          message: `Invalid transition from ${order.status} to ${action}`,
        });
      }

      const totalPrepTime = order.Order.reduce(
        (sum, item) => sum + item.prep_time,
        0,
      );
      const PREP_TIME_MINUTES = totalPrepTime / order.Order.length;
      const readyAt = Date.now() + PREP_TIME_MINUTES * 60000;
      order.status = action;
      order.readyAt = readyAt;
      //order.timeline.push({ status: action, at: new Date() });

      await order.save();

      io.to(`order:${order._id}`).emit("order:update", order);

      io.to("driver").emit("order:add", order);

      res.status(200).json(order);
    } catch (err) {
      console.error("Admin transition error:", err);
      return res.status(500).json({ message: err.message });
    }
  },
);
//Route for state transition - Driver
router.put(
  "/:orderId/driver-transition",
  protect,
  requireDriver,
  async (req, res) => {
    const token = process.env.ACCESS_TOKEN;
    const chatId = process.env.CHAT_ID;
    const { orderId } = req.params;
    const { action, paid } = req.body.payload;
    try {
      const order = await NewOrder.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const transitions = ["READY", "OUT_FOR_DELIVERY", "NEAR_ME", "DELIVERED"];

      const currentIndex = transitions.indexOf(order.status);
      const nextIndex = transitions.indexOf(action);

      if (currentIndex === -1 || nextIndex === -1) {
        return res.status(400).json({ message: "Invalid status" });
      }

      if (nextIndex !== currentIndex + 1 || order.status?.includes(action)) {
        return res.status(400).json({
          message: `Invalid transition from ${order.status} to ${action}`,
        });
      }

      if (action === "DELIVERED") {
        try {
          const newMessage = `✅  Hey ILYASS, Order delivered successfully !
    
          Order :
    
          ${order.Order.map(
            (item, index) =>
              ` ${item.Qty} ${item.name} ${item.completeMenu === true ? "Menu complete" : "SOLO"} `,
          ).join("+")}
    
          Name : ${order.name}
    
          Phone : ${order.phone}

          Address : ${order.address}

          Cash : ${paid} DH
    
          `;

          await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: newMessage,
          });

          order.status = action;
          await order.save();

          io.to(`order:${order._id}`).emit("order:update", order);
          io.to("admin").emit("order:update", order);

          setTimeout(
            async () => {
              await NewOrder.findByIdAndDelete(order._id);

              io.to(`order:${orderId}`).emit("order:delete", order);
              io.to("admin").emit("order:delete", orderId);
              io.to("driver").emit("order:delete", orderId);
            },
            5 * 60 * 1000,
          );
          return res.status(200).json(order);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }

      order.status = action;
      await order.save();

      io.to(`order:${order._id}`).emit("order:update", order);
      io.to("admin").emit("order:update", order);

      res.status(200).json(order);
    } catch (err) {
      console.error("Driver transition error:", err);
      return res.status(500).json({ message: err.message });
    }
  },
);
//Route for updating driver location - Driver
router.post("/setLocation", protect, requireDriver, async (req, res) => {
  const { Latitude, Longitude } = req.body;

  try {
    const orders = await NewOrder.find({ status: "OUT_FOR_DELIVERY" });

    for (const order of orders) {
      const [orderLng, orderLat] = order.location.coordinates;

      const distance = getDistanceInMeters(
        Latitude,
        Longitude,
        orderLat,
        orderLng,
      );

      // send driver location update
      io.to(`order:${order._id}`).emit("order:driverLocation", req.body);

      if (distance <= 150 && order.status === "OUT_FOR_DELIVERY") {
        order.status = "NEAR_ME";
        await order.save();
        io.to("admin").emit("order:update", order);
        io.to("driver").emit("order:update", order);
        io.to(`order:${order._id}`).emit("order:update", order);
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Save error:", error.message);
    res.status(500).json({ message: error.message });
  }
});
//Route for sending feedback - User
router.post("/feedback", async (req, res) => {
  const { rating, comment, name, orderId } = req.body;
  const token = process.env.ACCESS_TOKEN;
  const chatId = process.env.CHAT_ID;

  try {
    await NewOrder.findByIdAndDelete(orderId);

    try {
      const newMessage = `⭐  Hey ILYASS, Great news !

      ${name} rated your shop ⭐ ${rating}/5 ${comment ? `and left a comment : ${comment}` : ""}`;

      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: newMessage,
      });

      io.to(`order:${orderId}`).emit("order:delete", orderId);

      io.to("driver").emit("order:delete", orderId);
      io.to("admin").emit("order:delete", orderId);
    } catch (error) {
      console.error("Save error:", error);
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: error.message });
  }
});
//Route for updating available hours - Admin
router.put("/admin/working-hours", protect, requireAdmin, async (req, res) => {
  const workingHours = req.body;
  const CollectionID = process.env.HOURS_COLLECTION_ID;

  try {
    await StoreHours.findByIdAndUpdate(CollectionID, {
      workingHours,
    });

    io.emit("order:updateHours", workingHours);

    res.json({ ok: true });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: error.message });
  }
});
//Route for fetching store available hours - User
router.get("/working-hours", async (req, res) => {
  const CollectionID = process.env.HOURS_COLLECTION_ID;
  try {
    const response = await StoreHours.findById(CollectionID);
    const { workingHours } = response;
    const workinghours = { workingHours };
    res.json(workinghours);
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: error.message });
  }
});
router.put(
  "/menu/:id/image",
  protect,
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const item = await StoreMenu.findOneAndUpdate(
        { "items._id": req.params.id },
        {
          $set: {
            "items.$.image": `/uploads/${req.file.filename}`,
          },
        },
        { new: true },
      );
      io.emit("order:updateMenu", item.items);
      res.json(req.file.filename);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

export default router;
