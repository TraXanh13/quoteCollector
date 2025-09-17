import { useEffect, useState } from "react";
import { supabase } from "../../util/supabaseClient.jsx";
import { UserAuth } from "../../context/AuthContext.jsx";
import { useQuote } from "../../context/QuoteContext.jsx";

const QuoteEdit = () => {
	const [userGroups, setUserGroups] = useState([]);
	const { profile } = UserAuth();
	const { users, getUsers, getQuote } = useQuote();

	useEffect(() => {
		if (profile?.id) {
			getUserGroups();
		}
		const selectedQuoteID = new URLSearchParams(window.location.search).get(
			"id"
		);
		console.log("Selected Quote ID:", selectedQuoteID);
		if (selectedQuoteID) {
			const quoteData = getQuote(selectedQuoteID);
			console.log("Quote Data:", quoteData);
			// getQuote(selectedQuoteID).then((quoteData) => {
			// 	if (quoteData) {
			// 		document.getElementById("quote").value = quoteData.quote;
			// 		document.getElementById("author").value = quoteData.author_id;
			// 		document.getElementById("group").value = quoteData.group_id;
			// 	}
			// });
		}
	}, [profile?.id]);

	useEffect(() => {
		// When userGroups is loaded, fetch users for the first group
		if (userGroups.length > 0) {
			const firstGroupID = userGroups[0].groups.id;
			getUsers(firstGroupID);
		}
	}, [userGroups]);

	// Pulls from supabase to get all the groups associated to the logged in user
	async function getUserGroups() {
		const { data, error } = await supabase
			.from("group_members")
			.select("groups(name, id)")
			.eq("user_id", profile?.id)
			.order("groups(name)", { ascending: false });

		if (error) {
			console.error("Error fetching user groups:", error);
		} else {
			setUserGroups(data);
		}

		if (!data || data.length === 0) {
			console.warn("No groups found in the database.");
		}
	}

	// Generates options for the user dropdown
	function getUserOption() {
		return users.map((user) => (
			<option key={user.user_id} value={user.user_id}>
				{user.profiles.first_name} {user.profiles.last_name}
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
		const recorder_userID = profile?.user_id;
		const isAnonymous =
			formData.get("recorder") === "markAsAnonymous" ? true : false;
		if (!quote || !author || !recorder) {
			alert("Please fill in all fields.");
			return;
		}

		// TODO: Set this as a loading state
		alert(`Quote submitted!`);
		updateQuote({
			group: group,
			quote: quote,
			author: author,
			isAnonymous: isAnonymous,
		});
	}

	async function updateQuote({ id, group, quote, author, isAnonymous }) {
		const { error } = await supabase
			.from("quotes")
			.update([
				{
					author_id: author,
					group_id: group,
					is_anon: isAnonymous,
					quote: quote,
				},
			])
			.eq("id", id);
		if (error) {
			console.error("Error updating quote:", error);
		} else {
			alert("Quote updated successfully");
		}
	}

	return (
		<div>
			{console.log("Inside quote edit")}
			<form
				className="grid grid-cols-2 gap-4 m-auto max-w-2xl p-4 border-2 border-gray-300 rounded-lg shadow-md dark:bg-overlay-dark"
				onSubmit={handleSubmit}
			>
				<section className="col-span-2 flex mx-auto">
					<label htmlFor="quote" className="col-span-2">
						Enter a Quote to Group:
						<select
							className="my-auto mx-4"
							id="group"
							name="group"
							onChange={(event) => {
								const selectedGroupID = event.target.value;
								getUsers(selectedGroupID);
							}}
						>
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

export default QuoteEdit;
