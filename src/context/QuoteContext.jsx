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
			console.warn("No users found in the database.");
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

	return <QuoteContext.Provider value={{}}>{children}</QuoteContext.Provider>;
};

export const useQuote = () => {
	return useContext(QuoteContext);
};
