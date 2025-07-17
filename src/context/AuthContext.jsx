import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(undefined);

	// New user sign up
	const signUpNewUser = async (email, password) => {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		if (error) {
			console.error("Error signing up:", error);
			return { success: false, error };
		}
		return { success: true, data };
	};

	// Sign in function
	const signInUser = async (email, password) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (error) {
				console.error("Error signing in:", error);
				return { success: false, error };
			}

			setSession(data.session);
			return { success: true, data };
		} catch (error) {
			console.error("Unexpected error during sign in:", error);
			return { success: false, error };
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	// Sign out function
	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error);
		} else {
			setSession(undefined);
		}
	};

	return (
		<AuthContext.Provider
			value={{ session, signInUser, signOut, signUpNewUser }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
