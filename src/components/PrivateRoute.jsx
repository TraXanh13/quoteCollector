import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const { session, loading } = UserAuth(); // Remove profile dependency

	// Show loading while checking authentication
	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				Loading...
			</div>
		);
	}

	// Check authentication - only need session
	if (!session) {
		return <Navigate to="/signup" replace />;
	}

	return children;
};

export default PrivateRoute;
