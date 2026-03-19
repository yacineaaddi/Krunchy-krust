import { CreateTrackingAction as TrackingAction } from "./actions/TrackingAction";
import { CreateOrderAction as OrderAction } from "./actions/OrderAction";
import OrdersConfirmations from "./features/orders/OrdersConfirmations";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Orderstracking from "./features/tracking/Orderstracking";
import AppLayout from "./features/appLayout/AppLayout";
import HomePage from "./features/home/Homepage";
import NotFound from "./components/NotFound";
import Cart from "./features/cart/Cart";
import Menu from "./features/menu/Menu";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order-confirmation",
        element: <OrdersConfirmations />,
        action: OrderAction,
      },
      {
        path: "/tracking",
        element: <Orderstracking />,
        action: TrackingAction,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
