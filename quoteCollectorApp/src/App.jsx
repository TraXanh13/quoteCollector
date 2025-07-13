import './App.css'

function App() {

  return (
    <>
      <div>
        <h1>Welcome to Quote Collector!</h1>
        <p>Collect and share your favorite quotes!</p>
        <form>
          <label htmlFor="quote" className="spanCol2">Enter a Quote:</label>
          <input type="textarea" id="quote" className="spanCol2" name="quote" placeholder="Type your quote here..." required />
          <section>
            <label htmlFor="author">Author:</label>
            <input type="text" id="author" name="author" placeholder="Author's name" required />
          </section>
          <section>
            <label htmlFor="author">Author:</label>
            <input type="text" id="author" name="author" placeholder="Author's name" required />
          </section>
          <button type="submit">Submit Quote</button>
        </form>
      </div>
    </>
  )
}

export default App
