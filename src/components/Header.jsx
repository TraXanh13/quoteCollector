import React from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
	const { session, profile, signOut } = UserAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			// Add a timeout to prevent hanging
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Sign out timeout")), 5000)
			);

			await Promise.race([signOut(), timeoutPromise]);
		} catch (error) {
			console.error("Error during sign out:", error);
		} finally {
			navigate("/signin");
		}
	};

	return session != undefined ? (
		<header className="top-0 flex justify-between items-center p-4">
			<div className="flex items-center gap-4">
				<Link to="/dashboard" className="text-text dark:text-text-dark">
					Quote Collector
				</Link>
				<Link to="/who-said-it" className="text-text dark:text-text-dark">
					Who Said It?
				</Link>
			</div>

			<div className="flex items-center gap-4">
				<Link to="/edit-profile" className="text-text dark:text-text-dark">
					{profile?.username}
				</Link>
				<button
					onClick={handleSignOut}
					className="text-text dark:text-text-dark"
				>
					Sign Out!
				</button>
			</div>
		</header>
	) : (
		<header className="top-0 flex justify-between items-center p-4">
			<Link to="/" className="text-text dark:text-text-dark">
				Quote Collector
			</Link>
			<Link to="/signin" className="text-text dark:text-text-dark">
				Sign In
			</Link>
		</header>
	);
};

export default Header;
