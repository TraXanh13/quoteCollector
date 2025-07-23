import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Signin = () => {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState("");

	const { session, signInUser } = UserAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		if (session) {
			navigate("/dashboard", { replace: true });
		}
	}, [session, navigate]);

	const handleSignIn = async (e) => {
		e.preventDefault();
		try {
			const result = await signInUser(email, password);

			if (result.success) {
				// Navigation handled by useEffect
			} else {
				setError(
					result.error.message || "Failed to sign in. Please try again."
				);
			}
		} catch (error) {
			setError("Failed to sign in. Please try again. " + error.message);
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
				<button type="submit">Sign In</button>
				{error && (
					<p className="text-red-500 text-center mt-2">
						{error}, please try again
					</p>
				)}
			</div>
			<p className="text-center mt-4">
				Are you a new user? <Link to="/signup">Sign up!</Link>
			</p>
		</form>
	);
};

export default Signin;
