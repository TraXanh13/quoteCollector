import React from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
	const { session, signOut } = UserAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate("/signin");
		} catch (error) {
			console.error("Error during sign out:", error);
		}
	};
	return (
		<header className="top-0 flex justify-between items-center p-4 bg-gray-800 text-white">
			<p>Quote Collector</p>
			{session == undefined ? (
				<Link to="/signin">Sign In</Link>
			) : (
				<a onClick={handleSignOut}>Sign Out</a>
			)}
		</header>
	);
};

export default Header;
