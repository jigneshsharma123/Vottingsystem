import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [option, setOption] = useState("");
  const [totalResponses, setTotalResponses] = useState(0);
  const [option1Responses, setOption1Responses] = useState(0);
  const [option2Responses, setOption2Responses] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const handleOptionChange = (e) => {
    setOption(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!option) {
      setError("Please select at least one option");
      return;
    }
    try {
      await axios.post("vottingsystem-api-server.vercel.app/submit", { option });
      fetchResults();
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get("vottingsystem-api-server.vercel.app/results");
      setTotalResponses(response.data.total);
      setOption1Responses(response.data.results["Option 1"] || 0);
      setOption2Responses(response.data.results["Option 2"] || 0);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f2f2f2",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: "10px" }}>
        Are you a Vegetarian or Non-Vegetarian?
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="radio"
            id="option1"
            name="option"
            value="Option 1"
            onChange={handleOptionChange}
            style={{ marginRight: "10px" }}
          />
          <label htmlFor="option1" style={{ marginRight: "10px" }}>
            Vegetarian
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="option2"
            name="option"
            value="Option 2"
            onChange={handleOptionChange}
            style={{ marginRight: "10px" }}
          />
          <label htmlFor="option2" style={{ marginRight: "10px" }}>
            Non-Vegetarian
          </label>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit
        </button>
        {error && <p style={{ color: "red", marginBottom: "5px" }}>{error}</p>}
      </form>
      {showResults && (
        <>
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            Voting Results
          </h2>
          <p style={{ marginBottom: "5px" }}>
            Total Responses - {totalResponses}
          </p>
          <p style={{ marginBottom: "5px" }}>
            Responses for Option 1 - {option1Responses}
          </p>
          <p style={{ marginBottom: "5px" }}>
            Responses for Option 2 - {option2Responses}
          </p>
        </>
      )}
    </div>
  );
}

export default App;
