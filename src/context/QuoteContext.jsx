import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../util/supabaseClient";
import { UserAuth } from "./AuthContext.jsx";

const QuoteContext = createContext();

export const QuoteProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [userGroups, setUserGroups] = useState([]);
	const { profile } = UserAuth();

	useEffect(() => {
		getUserGroups();
		getUsers();
	}, []);

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

	// Pulls from supabase to get all the quotes associated to the logged in user
	async function getQuotes() {
		// Fetch quotes from the API or context
		const { data, error } = await supabase
			.from("quotes")
			.select(
				"id, author_id, group_id, quote, is_anon, author:profiles!author_id(id, first_name, last_name, username), group:groups!group_id(id, name)"
			)
			.eq("recorder_id", profile?.id)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching quotes:", error);
		} else {
			return data;
		}
		return [];
	}

	// Pulls from supabase to get a specific quote by ID
	async function getQuote(id) {
		// Fetch quotes from the API or context
		const { data, error } = await supabase
			.from("quotes")
			.select(
				"id, author_id, group_id, quote, is_anon, author:profiles!author_id(id, first_name, last_name, username), group:groups!group_id(id, name)"
			)
			.eq("recorder_id", profile?.id)
			.eq("id", id)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching quotes:", error);
		} else {
			return data;
		}
		return [];
	}

	// Removes a quote from the database
	async function removeQuote(quoteID) {
		const { data, error } = await supabase
			.from("quotes")
			.delete()
			.eq("id", quoteID);

		if (error) {
			console.error("Error deleting quote:", error);
		} else {
			return data;
		}
		return [];
	}

	async function getUsers(groupID = "") {
		let query = supabase
			.from("group_members")
			.select(
				"group_id, user_id, role, profiles!user_id(id, first_name, last_name)"
			);

		if (groupID) {
			query = query.eq("group_id", groupID);
		}

		const { data, error } = await query;

		if (error) {
			console.error("Error fetching users:", error);
		} else {
			const sorted = (data ?? []).sort((a, b) =>
				(a.profiles?.first_name || "").localeCompare(
					b.profiles?.first_name || ""
				)
			);
			setUsers(sorted);
			console.log("Fetched users:", sorted);
		}

		if (!data || data.length === 0) {
			console.warn("No users found in the database.");
		}
	}

	return (
		<QuoteContext.Provider
			value={{ users, userGroups, getQuotes, getQuote,removeQuote, getUsers }}
		>
			{children}
		</QuoteContext.Provider>
	);
};

export const useQuote = () => {
	return useContext(QuoteContext);
};
