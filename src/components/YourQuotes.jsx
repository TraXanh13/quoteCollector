import { React, useState, useEffect } from "react";
import { useQuote } from "../context/QuoteContext.jsx";

function YourQuotes() {
	const { getQuotes } = useQuote();
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		const fetchQuotes = async () => {
			const quotes = await getQuotes();
			setQuotes(quotes);
			console.log(quotes);
		};

		fetchQuotes();
	}, [getQuotes]);

	return (
		<div>
			<h1>Your Quotes Page</h1>
			<p>Here you can view and manage your quotes.</p>
			<ul>
				{quotes.map((quote) => (
					<li key={quote.id}>{quote.text}</li>
				))}
			</ul>
		</div>
	);
}

export default YourQuotes;
