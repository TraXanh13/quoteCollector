import { createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App";
import Signup from "./components/account/Signup";
import Signin from "./components/account/Signin";
import EditProfile from "./components/account/EditProfile";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import WhoSaidIt from "./components/WhoSaidIt.jsx";
import YourQuotes from "./components/YourQuotes.jsx";

const Layout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: (
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				),
			}, // Redirect authenticated users to dashboard
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
			{
				path: "/edit-profile",
				element: (
					<PrivateRoute>
						<EditProfile />
					</PrivateRoute>
				),
			},
			{
				path: "/who-said-it",
				element: (
					<PrivateRoute>
						<WhoSaidIt />
					</PrivateRoute>
				),
			},
			{
				path: "/your-quotes",
				element: (
					<PrivateRoute>
						<YourQuotes />
					</PrivateRoute>
				),
			},
			{ path: "/welcome", element: <App /> },
		],
	},
]);
