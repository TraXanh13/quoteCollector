import { createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App";
import Signup from "./components/account/Signup";
import Signin from "./components/account/Signin";
import EditProfile from "./components/account/EditProfile";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";

const Layout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export const router = createBrowserRouter([
	// { path: "/", element: <App /> },
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <App /> },
			{
				path: "/dashboard",
				element: (
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				),
			},
			{ path: "/signup", element: <Signup /> },
			{ path: "/signin", element: <Signin /> },
			{ path: "/edit-profile", element: <EditProfile /> },
		],
	},
]);
