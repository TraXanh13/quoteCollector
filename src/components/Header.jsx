import React from "react";
import { UserAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
	const { session, profile, signOut } = UserAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate("/signin");
		} catch (error) {
			console.error("Error during sign out:", error);
			navigate("/signin");
		}
	};

	return session != undefined ? (
		<header className="top-0 flex justify-between items-center p-4">
			<div className="flex items-center gap-4">
				<img
					src={"/src/assets/burgerMenuIcon.png"}
					alt="Menu"
					className="w-6 h-6 icon dark:filter-white"
				/>
				<Link to="/dashboard" className="text-text dark:text-text-dark">
					Quote Collector
				</Link>
				<Link to="/your-quotes" className="text-text dark:text-text-dark">
					Your Quotes
				</Link>
				<Link to="/all-quotes" className="text-text dark:text-text-dark">
					All Quotes
				</Link>
				<Link to="/who-said-it" className="text-text dark:text-text-dark">
					Who Said It?
				</Link>
			</div>

			<div className="flex items-center gap-4">
				<Link to="/edit-profile" className="text-text dark:text-text-dark">
					{profile?.username}
				</Link>
				<a onClick={handleSignOut} className="text-text dark:text-text-dark">
					Sign Out
				</a>
			</div>
		</header>
	) : (
		<header className="top-0 flex justify-between items-center p-4">
			<div className="flex items-center gap-4">
				<img
					src={"/src/assets/burgerMenuIcon.png"}
					alt="Menu"
					className="w-6 h-6 icon dark:filter-white"
				/>
				<Link to="/" className="text-text dark:text-text-dark">
					Quote Collector
				</Link>
			</div>
			<Link to="/signin" className="text-text dark:text-text-dark">
				Sign In
			</Link>
		</header>
	);
};

export default Header;
