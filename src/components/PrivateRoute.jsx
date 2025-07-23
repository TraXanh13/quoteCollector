import React from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { session, loading } = UserAuth(); // Remove profile dependency

    // Add detailed logging
    console.log("🔒 PrivateRoute check:", {
        loading,
        session: session ? "exists" : "null",
        sessionUserId: session?.user?.id,
    });

    // Show loading while checking authentication
    if (loading) {
        console.log("🔒 PrivateRoute: Still loading, showing loading screen");
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
        console.log("🔒 PrivateRoute: No session, redirecting to signup");
        return <Navigate to="/signup" replace />;
    }

    console.log("🔒 PrivateRoute: Session exists, rendering children");
    return children;
};

export default PrivateRoute;
