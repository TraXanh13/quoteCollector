import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Signup = () => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState("");

	const { session, signUpNewUser } = UserAuth();
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const result = await signUpNewUser(email, password);

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
			onSubmit={handleSignUp}
			className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg dark:bg-overlay-dark"
		>
			<h1 className="text-center mb-8">Sign up today!</h1>
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
				Already have an account? <Link to="/signin">Sign in!</Link>
			</p>
		</form>
	);
};

export default Signup;
