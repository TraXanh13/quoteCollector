import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../util/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(undefined);
	const [profile, setProfile] = useState(undefined);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			if (session) {
				assignProfile();
			} else {
				setProfile(undefined);
			}
		});
	}, []);

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

	// Check if profile exists via user ID
	const assignProfile = async () => {
		const { data } = await supabase
			.from("profiles")
			.select("*")
			.eq("user_id", `${session?.user?.id}`);

		if (data) {
			console.log("Profile found:", data);
			setProfile(data);
		} else {
			console.warn("No profile found for user ID:", session?.user?.id);
			setProfile(undefined);
		}
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
			console.log("Sign in successful:", data.session.user);
			alert("check Console");
			await setSession(data.session);
			assignProfile();
			return { success: true, data };
		} catch (error) {
			console.error("Unexpected error during sign in:", error);
			return { success: false, error };
		}
	};

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
			value={{
				session,
				profile,
				assignProfile,
				signInUser,
				signOut,
				signUpNewUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
