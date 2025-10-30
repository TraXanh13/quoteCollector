import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../util/supabaseClient.jsx";
import { UserAuth } from "../../context/AuthContext.jsx";
import { useQuote } from "../../context/QuoteContext.jsx";

const QuoteEdit = () => {
	const [userGroups, setUserGroups] = useState([]);
	const { profile } = UserAuth();
	const { users, getUsers, getQuote } = useQuote();
	const [quote, setQuote] = useState('');
	const [author, setAuthor] = useState('');
	const [group, setGroup] = useState('');
	const [isAnonymous, setIsAnonymous] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (profile?.id) {
			getUserGroups();
		}
		const selectedQuoteID = new URLSearchParams(window.location.search).get(
			"id"
		);
		if (selectedQuoteID) {
			getQuote(selectedQuoteID).then((quoteData) => {
				console.log("Quote Data:", quoteData);
				if (quoteData && quoteData[0]) {
					setQuote(quoteData[0].quote);
					setAuthor(quoteData[0].author_id);
					setGroup(quoteData[0].group_id);
					setIsAnonymous(quoteData[0].is_anon);
				}
			});
		}
	}, [profile?.id]);

	const fetchUsersForGroup = useCallback((groupId) => {
		if (groupId) {
			console.log("Selected Group ID for fetching users:", groupId);
			getUsers(groupId);
		}
	}, [getUsers]);

	useEffect(() => {
		// When userGroups is loaded and group is selected, fetch users for the specific group
		if (userGroups.length > 0 && group) {
			fetchUsersForGroup(group);
		}
	}, [userGroups, group, fetchUsersForGroup]);

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
		return users.map((usr) => (
			usr.user_id === author ? (
				<option key={usr.user_id} value={usr.user_id} selected>
					{usr.profiles.first_name} {usr.profiles.last_name}
				</option> 
			) : (
				<option key={usr.user_id} value={usr.user_id}>
					{usr.profiles.first_name} {usr.profiles.last_name}
				</option>
			)
		));
	}

	// Generates options for the group dropdown
	function getGroupOptions() {
		return userGroups.map((grp) => (
			grp.groups.id === group ? (
				<option key={grp.groups.id} value={grp.groups.id} selected>
					{grp.groups.name}
				</option>
			) : (
				<option key={grp.groups.id} value={grp.groups.id}>
					{grp.groups.name}
				</option>
			)
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

		// Redirect to Your Quotes page after update
		navigate("/your-quotes");
	}

	async function updateQuote({ group, quote, author, isAnonymous }) {
		const selectedQuoteID = new URLSearchParams(window.location.search).get(
			"id"
		);

		const { error } = await supabase.from("quotes").update([
			{
				author_id: author,
				group_id: group,
				is_anon: isAnonymous,
				quote: quote,
			},
		])
		.eq("id", selectedQuoteID);
		if (error) {
			console.error("Error updating quote:", error);
		} else {
			alert("Quote updated successfully");
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
						<select
							className="my-auto mx-4"
							id="group"
							name="group"
							onChange={(event) => {
								const selectedGroupID = event.target.value;
								setGroup(selectedGroupID);
								fetchUsersForGroup(selectedGroupID);
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
					value={quote}
					onChange={(e) => setQuote(e.target.value)}
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
						checked={isAnonymous}
						onChange={(e) => setIsAnonymous(e.target.checked)}
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
