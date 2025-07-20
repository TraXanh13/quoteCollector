import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import QuoteEntry from "./QuoteEntry";

const Dashboard = () => {
	const { session, profile } = UserAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// Check if user has a profile, if not redirect to edit profile
		if (session && profile === undefined) {
			navigate("/edit-profile");
		}
	}, [session, profile, navigate]);

	return (
		<div className="w-screen p-2 text-center my-0 mx-auto">
			<h1>Welcome to Quote Collector!</h1>
			<p>Collect and share your favorite quotes!</p>
			<QuoteEntry />
		</div>
	);
};

export default Dashboard;
