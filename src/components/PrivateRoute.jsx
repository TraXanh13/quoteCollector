import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const { session, profile, loading } = UserAuth();

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

	// Check authentication
	if (!session) {
		return <Navigate to="/signup" replace />;
	}

	// If we have a session but no profile, redirect to profile setup
	if (!loading && session && profile === null) {
		console.log("Redirecting to edit-profile");
		return <Navigate to="/edit-profile" replace />;
	}

	return children;
};

export default PrivateRoute;
