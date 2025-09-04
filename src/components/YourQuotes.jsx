import { React, useState, useEffect } from "react";
import { useQuote } from "../context/QuoteContext.jsx";

function YourQuotes() {
	const { getQuotes, removeQuote } = useQuote();
	const [quotes, setQuotes] = useState([]);

	useEffect(() => {
		const fetchQuotes = async () => {
			const quotes = await getQuotes();
			setQuotes(quotes);
		};

		fetchQuotes();
	}, [getQuotes]);

	const getQuoteCard = (quote) => {
		const QUOTE_CARD_TEXT_LIMIT = 1000;
		return (
			<div
				id={quote.id}
				key={quote.id}
				className="border-2 border-white bg-gray-900 rounded-md relative flex flex-col m-4 min-h-60 p-4 w-full md:w-1/4"
			>
				<p className="font-bold mx-auto">{quote.group.name}</p>
				<div className="flex mb-4 mx-auto">
					<div className="right-0">
						<button className="border-2 border-white bg-transparent text-white p-1 rounded mr-2">
							Edit
						</button>
						<button
							className="bg-red-500 text-white p-1 rounded"
							onClick={() => {
								if (
									window.confirm("Are you sure you want to delete this quote?")
								) {
									removeQuote(quote.id);
									setQuotes(quotes.filter((q) => q.id !== quote.id));
								}
							}}
						>
							Delete
						</button>
					</div>
				</div>
				<div className="flex flex-col flex-grow align-middle justify-center">
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
						className="absolute w-8 h-8 rounded-full top-2 right-4 filter dark:invert"
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
