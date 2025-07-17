import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Signin = () => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState("");

	const { session, signInUser } = UserAuth();
	const navigate = useNavigate();

	const handleSignIn = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await signInUser(email, password);

			if (result.success) {
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Error during sign up:", error);
			setError("Failed to sign up. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSignIn}
			className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg dark:bg-overlay-dark"
		>
			<h1 className="text-center mb-8">Sign in</h1>
			<div className="flex flex-col">
				<input
					type="email"
					id="email"
					name="email"
					placeholder="Email@email.com"
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">Sign Up</button>
				{error && <p className="text-red-500 text-center mt-2">{error}</p>}
			</div>
			<p className="text-center mt-4">
				Are you a new user? <Link to="/signup">Sign up!</Link>
			</p>
		</form>
	);
};

export default Signin;
