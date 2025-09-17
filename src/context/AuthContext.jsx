import {
	createContext,
	useEffect,
	useState,
	useContext,
	useCallback,
	useRef,
} from "react";
import { supabase } from "../util/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [profile, setProfile] = useState(undefined);
	const [loading, setLoading] = useState(true);
	const [profileLoading, setProfileLoading] = useState(false);

	// Refs to always get current values in event handlers
	const sessionRef = useRef(session);
	const profileRef = useRef(profile);

	// Update refs when state changes
	useEffect(() => {
		sessionRef.current = session;
		profileRef.current = profile;
	}, [session, profile]);

	const assignProfile = useCallback(async (userID) => {
		if (!userID) {
			setProfile(null);
			return;
		}

		setProfileLoading(true);

		try {
			// Shorter timeout but still allow page to load
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(
					() =>
						reject(
							new Error("Profile fetch timeout - proceeding without profile")
						),
					2000
				)
			);

			const profilePromise = supabase
				.from("profiles")
				.select("id, user_id, first_name, last_name, username")
				.eq("user_id", userID)
				.single();

			const { data, error } = await Promise.race([
				profilePromise,
				timeoutPromise,
			]);
			if (error) {
				console.log("Profile fetch error:", error);
				setProfile(null);
			} else if (data) {
				console.log("Profile found:", data);
				setProfile(data);
			} else {
				console.log("No profile data returned");
				setProfile(null);
			}
		} catch (error) {
			setProfile(null);
		} finally {
			setProfileLoading(false);
			setLoading(false);
		}
	}, []);

	// Initialize auth state and profile
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
				}
				setLoading(false);
			}
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, [assignProfile]);

	// Refetch profile when the tab becomes visible
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				const currentSession = sessionRef.current;
				const currentProfile = profileRef.current;

				if (currentSession && currentSession.user && !currentProfile) {
					assignProfile(currentSession.user.id);
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [assignProfile]); // Only assignProfile as dependency

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
