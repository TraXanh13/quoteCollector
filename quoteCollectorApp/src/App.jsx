import './App.css'
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data, error } = await supabase
      .from("testusers")
      .select()
    await console.log("Fetched users:", data);

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data);
    }
  }

  function getUserOption() {
    console.log("Users:", users);
    return users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    ));
  }

  return (
    <>
      <div>
        <h1>Welcome to Quote Collector!</h1>
        <p>Collect and share your favorite quotes!</p>
        <form>
          <label htmlFor="quote" className="spanCol2">Enter a Quote:</label>
          <input type="textarea" id="quote" className="spanCol2" name="quote" placeholder="Type your quote here..." required />
          <section>
            <label htmlFor="author">Who said it:</label>
            <select id="author" name="author" required>
              <option value="">Select an author</option>
              {getUserOption()}
              {/* <option value="">Select an author</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                {user.username}
                </option>
                ))} */}
            </select>
          </section>
          <section>
            <label htmlFor="author">Whose recording it:</label>
            <input type="text" id="author" name="author" placeholder="Author's name" required />
          </section>
          <button type="submit">Submit Quote</button>
        </form>
      </div>
    </>
  )
}

export default App
