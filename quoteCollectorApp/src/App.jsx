import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Importing the Header component
import Header from "./components/header";

function App() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.order("first_name", { ascending: true });

		if (error) {
			console.error("Error fetching users:", error);
		} else {
			setUsers(data);
		}

		if (!data || data.length === 0) {
			console.warn("No users found in the database.");
		}
	}

	function getUserOption() {
		return users.map((user) => (
			<option key={user.id} value={user.id}>
				{user.first_name} {user.last_name}
			</option>
		));
	}

	const USER_OPTIONS = getUserOption();

	return (
		<>
			<Header />
			<div className="w-screen p-2 text-center my-0 mx-auto">
				<h1>Welcome to Quote Collector!</h1>
				<p>Collect and share your favorite quotes!</p>
				<form className="grid grid-cols-2 gap-4 m-auto max-w-2xl p-4 border-2 border-gray-300 rounded-lg shadow-md">
					<label htmlFor="quote" className="col-span-2">
						Enter a Quote:
					</label>
					<textarea
						id="quote"
						className="col-span-2"
						name="quote"
						placeholder="Type your quote here..."
						required
					/>
					<section>
						<label htmlFor="author">Who said it:</label>
						<select id="author" name="author" required>
							<option value="">Select an author</option>
							{USER_OPTIONS}
						</select>
					</section>
					<section>
						<label htmlFor="recorder">Whose recording it:</label>
						<select id="recorder" name="recorder" required>
							<option value="">Select a recorder</option>
							<option value="Anonymous">Anonymous</option>
							{USER_OPTIONS}
						</select>
					</section>
					<button type="submit">Submit Quote</button>
				</form>
			</div>
		</>
	);
}

export default App;
