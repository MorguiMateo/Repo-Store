import { createBrowserRouter } from "react-router-dom";
import Layout from "../shared/components/Layout";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import HomePage from "../modules/home/pages/HomePage";
import LoginPage from "../modules/auth/pages/LoginPage";
import CartPage from "../modules/cart/pages/CartPage";
import CheckoutPage from "../modules/checkout/pages/CheckoutPage";
import OrdersPage from "../modules/orders/pages/OrdersPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/cart', element: <CartPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/orders', element: <OrdersPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
        ],
      },
    ],
  },
])

export default router