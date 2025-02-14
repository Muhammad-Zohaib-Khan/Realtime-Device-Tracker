import Login from "./Components/login";
import Signup from "./Components/signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome_page from "./Components/welcome";
import Create_user from "./Components/create_user";
import Read_users from "./Components/read_users";
import Update_user from "./Components/update_user";
import Show from "./Components/leaflet";
import Delete from "./Components/delete_user";

const ErrorPage = () => {
  return (
    <div>
      <h1>Oops! Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path:"/create",
    element:<Create_user/>
  },
  {
    path:"/welcome",
    element: <Welcome_page/>
  },
  {
    path:"/read",
    element:<Read_users/>
  },
  {
    path:"/edit/:id",
    element:<Update_user />
  },
  {
    path:"/delete/:id",
    element:<Delete/>
  },
  {
    path:"/real_time",
    element:<Show />
  },
  {
    path: "*", // Wildcard route to catch unmatched paths
    element: <ErrorPage />,
  },
]);

const App = () => {
  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;