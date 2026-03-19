import mongoose from "mongoose";

const AdditionalSchema = new mongoose.Schema(
  {
    Qty: { type: Number, required: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      index: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    Order: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        Qty: { type: Number, required: true },
        completeMenu: { type: Boolean, default: true },
        prep_time: { type: Number, required: true },
        additional: { type: [AdditionalSchema], default: [] },
      },
    ],
    readyAt: { type: Number },
    status: { type: String, default: "PLACED" },
    reject_message: { type: String, required: false },
    orderId: { type: Number },

    /*timeline: [
      {
        status: { type: String, default: "PREPARING" },
        at: { type: Date, default: Date.now },
      },
    ],*/
  },
  { timestamps: true },
);

orderSchema.index({ location: "2dsphere" });

export const NewOrder =
  mongoose.models.NewOrder || mongoose.model("NewOrder", orderSchema);
