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

	const assignProfile = useCallback(async (userID) => {
		if (!userID) {
			setProfile(null);
			return;
		}

		try {
			const queryPromise = supabase
				.from("profiles")
				.select("*")
				.eq("user_id", userID)
				.single();

			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Profile query timeout")), 500)
			);

			const { data, error } = await Promise.race([
				queryPromise,
				timeoutPromise,
			]);

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
	}, []);

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
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error);
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
