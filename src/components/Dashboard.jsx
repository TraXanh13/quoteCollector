import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import QuoteEntry from "./quote/QuoteEntry";

const Dashboard = () => {
	const { session, profile, loading } = UserAuth();
	const navigate = useNavigate();

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-screen p-2 text-center my-0 mx-auto">
			<h1>Welcome to Quote Collector!</h1>
			<p>Collect and share your favorite quotes!</p>
			<QuoteEntry />
		</div>
	);
};

export default Dashboard;
