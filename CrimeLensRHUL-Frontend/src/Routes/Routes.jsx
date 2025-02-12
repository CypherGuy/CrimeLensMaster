import { createBrowserRouter } from "react-router-dom";
import Root from "../LRoot/Root";
import Error from '../Pages/Error/Error';
import Home from '../Pages/Home/index';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import ResetPassword from '../Pages/Reset/Reset';

const Routes = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,

        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/reset",
                element: <ResetPassword />
            },
            {
                path: "/crimePost",

            }
        ]
    },
]);

export default Routes;
