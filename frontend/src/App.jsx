import React, { useState } from "react";
import { PRODUCTS } from "./products";
import "./index.css";

function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const getRecommendations = async () => {
    const response = await fetch("https://ai-product-recommendation-system-llta.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_input: input,
        products: PRODUCTS
      })
    });

    const data = await response.json();
    console.log("BACKEND DATA RECEIVED:", data);
    setResults(data.results);
  };

  return (
    <div className="app-container">
      <h1>AI Product Recommendation</h1>

      <input
        type="text"
        className="input-box"
        placeholder="E.g. phone under $500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="btn" onClick={getRecommendations}>
        Get Recommendations
      </button>

      <div className="results">

        {/* All Products */}
        <h2>All Products:</h2>
        {PRODUCTS.map((p, i) => (
          <div key={i} className="result-item">
            {p.name} — ${p.price}
          </div>
        ))}

        {/* AI Recommendations */}
        <h2 style={{ marginTop: "25px" }}>Recommended Products:</h2>
        {Array.isArray(results) && results.length > 0 ? (
          results.map((item, i) => (
            <div key={i} className="result-item">{item}</div>
          ))
        ) : (
          <p style={{ marginTop: 10, color: "#555" }}>
            No recommendations yet...
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
