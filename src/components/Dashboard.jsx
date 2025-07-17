import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const { session, signOut } = UserAuth();
	const navigate = useNavigate();

	const handSignOut = async (e) => {
		e.preventDefault();
		try {
			await signOut();
			navigate("/");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<div>
			<h1>Dashboard</h1>
			<h2>Welcome, {session?.user?.email}</h2>
			<button
				onClick={handSignOut}
				className="bg-link hover:bg-link-hover text-white px-4 py-2 rounded-button"
			>
				Sign out
			</button>
		</div>
	);
};

export default Dashboard;
