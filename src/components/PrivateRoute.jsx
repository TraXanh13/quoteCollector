import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const { session } = UserAuth();

	// Without this, a flicker of the locked page would be displayed.
	if (session === undefined) {
		return <div>Loading...</div>; // Optionally handle loading state
	}

	// If the session exist, show the contents of the dashboard, otherwise redirect to signup
	return <>{session ? <>{children}</> : <Navigate to="/signup" />}</>;
};

export default PrivateRoute;
