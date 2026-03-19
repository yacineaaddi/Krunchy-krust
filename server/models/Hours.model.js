import mongoose from "mongoose";

const TimeRangeSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false },
);

const WorkingDaySchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, required: true },
    ranges: { type: [TimeRangeSchema], default: [] },
  },
  { _id: false },
);

const StoreSchema = new mongoose.Schema({
  workingHours: {
    monday: { type: WorkingDaySchema, required: true },
    tuesday: { type: WorkingDaySchema, required: true },
    wednesday: { type: WorkingDaySchema, required: true },
    thursday: { type: WorkingDaySchema, required: true },
    friday: { type: WorkingDaySchema, required: true },
    saturday: { type: WorkingDaySchema, required: true },
    sunday: { type: WorkingDaySchema, required: true },
  },
});

export const StoreHours = mongoose.model("StoreHours", StoreSchema);
