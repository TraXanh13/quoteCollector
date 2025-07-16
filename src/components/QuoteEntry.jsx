import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const QuoteEntry = (props) => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		const { data, error } = await supabase
			.from("users")
			.select(
				`
				id,
				first_name, 
				last_name,
				group_members!inner(group_id)
				`
			)
			.in("group_members.group_id", [2])
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

	function handleSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const quote = formData.get("quote");
		const author = formData.get("author");
		const recorder = formData.get("recorder");
		if (!quote || !author || !recorder) {
			alert("Please fill in all fields.");
			return;
		}

		alert(`Quote submitted: "${quote}" by ${author}, recorded by ${recorder}`);
		addQuote(quote, author, recorder);
	}

	async function addQuote(quote, author, recorder, group = 1) {
		const { data, error } = await supabase.from("quotes").insert([
			{
				group: group,
				author: author,
				recorder: recorder,
				quote: quote,
			},
		]);
		if (error) {
			console.error("Error adding quote:", error);
		} else {
			alert("Quote added successfully:");
		}
	}

	return (
		<div className="w-screen p-2 text-center my-0 mx-auto">
			<h1>Welcome to Quote Collector!</h1>
			<p>Collect and share your favorite quotes!</p>
			<form
				className="grid grid-cols-2 gap-4 m-auto max-w-2xl p-4 border-2 border-gray-300 rounded-lg shadow-md"
				onSubmit={handleSubmit}
			>
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
						{USER_OPTIONS.slice(1)}
					</select>
				</section>
				<section>
					<label htmlFor="recorder">Whose recording it:</label>
					<select id="recorder" name="recorder" required>
						<option value="">Select a recorder</option>
						<option value="0">Anonymous</option>
						{USER_OPTIONS}
					</select>
				</section>
				<button type="submit" className="col-span-2 w-max px-4 mx-auto">
					Submit Quote
				</button>
			</form>
		</div>
	);
};

export default QuoteEntry;
