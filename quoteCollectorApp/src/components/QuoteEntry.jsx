const QuoteEntry = (props) => {
	return (
		<div className="w-screen p-2 text-center my-0 mx-auto">
			<h1>Welcome to Quote Collector!</h1>
			<p>Collect and share your favorite quotes!</p>
			<form className="grid grid-cols-2 gap-4 m-auto max-w-2xl p-4 border-2 border-gray-300 rounded-lg shadow-md">
				<label htmlFor="quote" className="col-span-2">
					Enter a Quote:
				</label>
				<textarea
					id="quote"
					className="col-span-2"
					name="quote"
					placeholder="Type your quote here..."
					required
				/>
				<section>
					<label htmlFor="author">Who said it:</label>
					<select id="author" name="author" required>
						<option value="">Select an author</option>
						{props.USER_OPTIONS}
					</select>
				</section>
				<section>
					<label htmlFor="recorder">Whose recording it:</label>
					<select id="recorder" name="recorder" required>
						<option value="">Select a recorder</option>
						<option value="Anonymous">Anonymous</option>
						{props.USER_OPTIONS}
					</select>
				</section>
				<button type="submit">Submit Quote</button>
			</form>
		</div>
	);
};

export default QuoteEntry;
