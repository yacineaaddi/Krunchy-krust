import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  price: Number,
  prep_time: Number,
  category: {
    type: String,
    enum: ["dish", "drink", "fries"],
  },

  available: {
    type: Boolean,
    default: true,
  },
});

const menuSchema = new mongoose.Schema({
  items: [menuItemSchema],
});

export const StoreMenu = mongoose.model("StoreMenu", menuSchema);
