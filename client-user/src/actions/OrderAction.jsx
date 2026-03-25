import toast from "react-hot-toast";
import api from "../api/api";

export async function CreateOrderAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    name: data.fullName,
    phone: data.phone,
    address: data.address,
    location: JSON.parse(data.location),
    Order: JSON.parse(data.cart),
  };

  try {
    const res = await api.post(`/neworder`, order);

    toast.success(`Order submited successfully`);

    const stored = localStorage.getItem("trackedIds");

    let parsed = [];

    try {
      parsed = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(error.response?.data || error.message);
      localStorage.removeItem("trackedIds");
      parsed = [];
    }

    const updated = [...parsed, res.data._id];

    localStorage.setItem("trackedIds", JSON.stringify(updated));

    return res.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}
