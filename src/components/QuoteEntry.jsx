import { useEffect, useState } from "react";
import { supabase } from "../util/supabaseClient";
import { UserAuth } from "../context/AuthContext.jsx";

const QuoteEntry = () => {
	const [users, setUsers] = useState([]);
	const [userGroups, setUserGroups] = useState([]);
	const { profile } = UserAuth();

	useEffect(() => {
		if (profile?.id) {
			getUserGroups();
		}
		getUsers();
	}, [profile?.id]);

	// Pulls from supabase to get all the groups associated to the logged in user
	async function getUserGroups() {
		const { data, error } = await supabase
			.from("group_members")
			.select("groups(name, id)")
			.eq("user_id", profile?.id)
			.order("groups(name)", { ascending: true });

		if (error) {
			console.error("Error fetching user groups:", error);
		} else {
			setUserGroups(data);
		}

		if (!data || data.length === 0) {
			console.warn("No groups found in the database.");
		}
	}

	async function getUsers() {
		// TODO: Populate the user dropdown with users from the database with the appropriate group
		const { data, error } = await supabase
			.from("profiles")
			.select("first_name, last_name, id")
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

	// Generates options for the user dropdown
	function getUserOption() {
		return users.map((user) => (
			<option key={user.id} value={user.id}>
				{user.first_name} {user.last_name}
			</option>
		));
	}

	// Generates options for the group dropdown
	function getGroupOptions() {
		return userGroups.map((group) => (
			<option key={group.groups.id} value={group.groups.id}>
				{group.groups.name}
			</option>
		));
	}

	const USER_GROUPS = getGroupOptions();
	const USER_OPTIONS = getUserOption();

	function handleSubmit(event) {
		event.preventDefault();

		// Collect form data
		const formData = new FormData(event.target);
		const group = formData.get("group");
		const quote = formData.get("quote");
		const author = formData.get("author");
		const recorder = profile?.id;
		const isAnonymous =
			formData.get("recorder") == "markAsAnonymous" ? true : false;
		if (!quote || !author || !recorder) {
			alert("Please fill in all fields.");
			return;
		}

		// TODO: Set this as a loading state
		alert(`Quote submitted!`);
		addQuote({
			group: group,
			quote: quote,
			author: author,
			recorder: recorder,
			isAnonymous: isAnonymous,
		});
	}

	async function addQuote({
		// This defaults to the test group
		group,
		quote,
		author,
		recorder,
		isAnonymous,
	}) {
		const { error } = await supabase.from("quotes").insert([
			{
				author_id: author,
				recorder_id: recorder,
				group_id: group,
				is_anon: isAnonymous,
				quote: quote,
			},
		]);
		if (error) {
			console.error("Error adding quote:", error);
		} else {
			alert("Quote added successfully");
		}
	}

	return (
		<div>
			<form
				className="grid grid-cols-2 gap-4 m-auto max-w-2xl p-4 border-2 border-gray-300 rounded-lg shadow-md dark:bg-overlay-dark"
				onSubmit={handleSubmit}
			>
				<section className="col-span-2 flex mx-auto">
					<label htmlFor="quote" className="col-span-2">
						Enter a Quote to Group:
						<select className="my-auto mx-4" id="group" name="group">
							{USER_GROUPS}
						</select>
					</label>
				</section>
				<textarea
					id="quote"
					className="col-span-2 p-2"
					name="quote"
					placeholder="Type your quote here..."
					required
				/>
				<section className="flex gap-2">
					<label htmlFor="author" className="my-auto">
						Who said it:
					</label>
					<select className="my-auto" id="author" name="author" required>
						<option value="">Select an author</option>
						{USER_OPTIONS}
					</select>
				</section>
				<section className="flex gap-2">
					<label htmlFor="recorder" className="my-auto">
						Mark as Anonymous:
					</label>
					<input
						type="checkbox"
						className="my-auto"
						id="recorder"
						name="recorder"
						value="markAsAnonymous"
					/>
				</section>
				<button type="submit" className="col-span-2 w-max px-4 mx-auto">
					Submit Quote
				</button>
			</form>
		</div>
	);
};

export default QuoteEntry;
