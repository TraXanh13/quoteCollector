import React from "react";
import { supabase } from "../../util/supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const EditProfile = () => {
	const [fname, setFname] = React.useState("");
	const [lname, setLname] = React.useState("");
	const [username, setUsername] = React.useState("");
	const { session, profile, assignProfile } = UserAuth();

	const handleEditProfile = async (e) => {
		e.preventDefault();
		try {
			const { data, error } = await supabase.from("profiles").upsert([
				{
					first_name: fname,
					last_name: lname,
					username: username,
					user_id: session.user.id,
				},
			]);
			if (error) throw error;
			alert("Profile was updated successfully!");
			assignProfile();
		} catch (error) {
			console.error("Error creating profile:", error);
		}
	};

	return (
		<form
			onSubmit={handleEditProfile}
			className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg dark:bg-overlay-dark"
		>
			{session && profile ? (
				<h1 className="text-center mb-8">Edit your profile</h1>
			) : (
				<h1 className="text-center mb-8">Set up your profile</h1>
			)}
			<div className="flex flex-col">
				<input
					type="text"
					id="first_name"
					name="first_name"
					placeholder="First Name"
					onChange={(e) => setFname(e.target.value)}
					required
				/>
				<input
					type="text"
					id="last_name"
					name="last_name"
					placeholder="Last Name"
					onChange={(e) => setLname(e.target.value)}
					required
				/>
				<input
					type="text"
					id="username"
					name="username"
					placeholder="Username"
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<button type="submit">Save</button>
				{session && profile ? (
					<Link to="/dashboard" className="text-center mt-4">
						Go Back
					</Link>
				) : (
					<button className="hidden" type="button">
						Go Back
					</button>
				)}
			</div>
		</form>
	);
};

export default EditProfile;
