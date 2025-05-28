import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import FriendsPage from "../pages/FriendPage";
import NewChatPage from "../pages/NewChatPage";

const Routes = () => {
  const { user } = useAuth();

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/friends",
          element: <FriendsPage />,
        },
        {
          path: "/new-chat",
          element: <NewChatPage />
        },
        {
          path: "/profile",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <LoginPage />, 
    },
    {
      path : "/register",
      element: <RegisterPage />,
    }
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...(!user ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;