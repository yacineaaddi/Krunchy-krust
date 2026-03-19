import toast from "react-hot-toast";
import api from "../api/api";

export async function CreateTrackingAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const feedback = {
    rating: data.rating,
    comment: data.comment,
    name: data.username,
    orderId: data.orderId,
  };
  try {
    const res = await api.post(`/feedback`, feedback);
    toast.success(` Submitted successfully!`);
    return res.data;
  } catch {
    throw Error("Failed sending feedback");
  }
}
