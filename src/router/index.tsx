import { createBrowserRouter } from "react-router-dom";
import Layout from "../shared/components/Layout";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import HomePage from "../modules/home/pages/HomePage";
import LoginPage from "../modules/auth/pages/LoginPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import CartPage from "../modules/cart/pages/CartPage";
import CheckoutPage from "../modules/checkout/pages/CheckoutPage";
import OrdersPage from "../modules/orders/pages/OrdersPage";
import OrderDetailPage from "../modules/orders/pages/OrderDetailPage";
import DireccionesPage from "../modules/direcciones/pages/DireccionesPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/cart', element: <CartPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/orders', element: <OrdersPage /> },
          { path: '/orders/:id', element: <OrderDetailPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/direcciones', element: <DireccionesPage /> },
        ],
      },
    ],
  },
])

export default router