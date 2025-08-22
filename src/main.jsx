import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QuoteProvider } from "./context/QuoteContext.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* Wrap the RouterProvider with AuthProvider and QuoteProvider to provide context to the entire app */}
		<AuthProvider>
			<QuoteProvider>
				<RouterProvider router={router} />
			</QuoteProvider>
		</AuthProvider>
	</StrictMode>
);
