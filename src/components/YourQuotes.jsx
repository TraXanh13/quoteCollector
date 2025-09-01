import { React, useState, useEffect } from "react";
import { useQuote } from "../context/QuoteContext.jsx";

function YourQuotes() {
	const { getQuotes } = useQuote();
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		const fetchQuotes = async () => {
			const quotes = await getQuotes();
			setQuotes(quotes);
		};

		fetchQuotes();
	}, [getQuotes]);

	const getQuoteCard = (quote) => {
		const QUOTE_CARD_TEXT_LIMIT = 100;
		console.log(quote);
		return (
			<div
				id={quote.id}
				key={quote.id}
				className="border-2 border-white bg-gray-900 rounded-md p-4 m-4 w-1/4 h-40 relative"
			>
				<div>
					<p>
						{quote.quote.length > QUOTE_CARD_TEXT_LIMIT
							? `${quote.quote.substring(0, QUOTE_CARD_TEXT_LIMIT)}...`
							: quote.quote}
					</p>
					{quote.author.username ? (
						<p className="italic ml-4 mt-4">- {quote.author.username}</p>
					) : (
						<p className="italic ml-4 mt-4">
							- {quote.author.first_name} {quote.author.last_name}
						</p>
					)}
				</div>
				{quote.is_anon ? (
					<img
						src="/src/assets/anonymous.png"
						alt="Anon Identifier"
						className="absolute w-8 h-8 rounded-full bottom-0 right-0 filter dark:invert"
					/>
				) : (
					<></>
				)}
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-4 h-fit text-center">
			<h1>Your Quotes Page</h1>
			<p>Here you can view and manage your quotes.</p>
			<div className="flex flex-wrap gap-4 h-fit justify-center align-middle">
				{quotes.map((quote) => getQuoteCard(quote))}
			</div>
		</div>
	);
}

export default YourQuotes;
