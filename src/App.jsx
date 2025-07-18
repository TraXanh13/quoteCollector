import { Link } from "react-router-dom";
function App() {
	return (
		<div className="text-center p-4 flex flex-col justify-center items-center overflow-y-hidden">
			<h1>Welcome to Quote Collector!</h1>
			<p>Collect and share your favorite quotes!</p>
			<br />
			<p>
				To get started, you will need to either{" "}
				<Link to="/signin">sign in</Link> or <Link to="/signup">sign up</Link>{" "}
				for a new account
			</p>
		</div>
	);
}

export default App;
