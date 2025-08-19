import {
	createContext,
	useEffect,
	useState,
	useContext,
	useCallback,
} from "react";
import { supabase } from "../util/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	const assignProfile = useCallback(
		async (userID) => {
			if (!userID) {
				setProfile(null);
				return;
			}

			// Don't refetch if we already have this user's profile
			if (profile && profile.user_id === userID) {
				return;
			}

			try {
				const { data, error } = await supabase
					.from("profiles")
					.select("id, user_id, first_name, last_name, username")
					.eq("user_id", userID)
					.single();

				if (error) {
					console.error("Error fetching profile:", error);
					setProfile(null);
				} else if (data) {
					setProfile(data);
				} else {
					setProfile(null);
				}
			} catch (error) {
				console.error("Unexpected error fetching profile:", error);
				setProfile(null);
			} finally {
				setLoading(false);
			}
		},
		[profile]
	); // Add profile as dependency

	useEffect(() => {
		let mounted = true;

		const initializeAuth = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error) {
					console.error("Error getting session:", error);
					if (mounted) {
						setSession(null);
						setLoading(false);
					}
					return;
				}

				if (mounted) {
					setSession(session);
					if (session && session.user) {
						await assignProfile(session.user.id);
					} else {
						setLoading(false);
					}
				}
			} catch (error) {
				console.error("Error initializing auth:", error);
				if (mounted) {
					setSession(null);
					setLoading(false);
				}
			}
		};

		initializeAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (mounted) {
				setSession(session);
				if (session && session.user) {
					await assignProfile(session.user.id);
				} else {
					setProfile(null);
					setLoading(false);
				}
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [assignProfile]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && session && !profile) {
				// Tab became visible and we have a session but no profile
				assignProfile(session.user.id);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [session, profile, assignProfile]);

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

			return { success: true, data };
		} catch (error) {
			console.error("Unexpected error during sign in:", error);
			return { success: false, error };
		}
	};

	const signOut = async () => {
		try {
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Sign out timeout")), 5000)
			);

			const signOutPromise = supabase.auth.signOut();

			const { error } = await Promise.race([signOutPromise, timeoutPromise]);

			if (error) {
				console.error("Error signing out:", error);
			}
		} catch (error) {
			console.error("Sign out failed or timed out:", error);
			// Force local cleanup even if API call failed
		} finally {
			setSession(null);
			setProfile(null);
			setLoading(false);
			localStorage.clear();
		}
	};

	return (
		<AuthContext.Provider
			value={{
				session,
				profile,
				loading,
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
