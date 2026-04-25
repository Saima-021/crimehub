// src/pages/SpamDetection.jsx

import { useState } from "react";
import axios from "axios";

const SpamDetection = () => {

  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {

    if (!content.trim()) return;

    try {

      setLoading(true);
      setResult(null);

      const response = await axios.post(
        "http://localhost:5000/api/spam",
        { content }
      );

      setResult(response.data);

    } catch (error) {

      setResult({
        status: "danger",
        message: "Failed to analyze content"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="mb-4">Spam Detection</h2>

      {/* Info Box */}
      <div className="alert alert-dark">
        <p className="mt-2 mb-0">
          This system analyzes emails, messages, and URLs to detect spam,
          phishing attempts, and suspicious content using AI and security filters.
        </p>
      </div>

      {/* Input Section */}
      <div className="card shadow-sm p-4 mt-4">

        <label className="form-label fw-bold">
          Enter Email, Message, or URL
        </label>

        <textarea
          className="form-control"
          rows="4"
          placeholder="Paste suspicious message, email text, or URL here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="btn btn-primary mt-3"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Detect Spam"}
        </button>

      </div>

      {/* Result Section */}
      {result && (
        <div className={`alert alert-${result.status} mt-4`}>

          <h5>{result.message}</h5>

          {result.data && (
            <div className="mt-3">

              <p>
                <strong>Classification:</strong>{" "}
                {result.data.classification}
              </p>

              <p>
                <strong>Spam Score:</strong>{" "}
                {result.data.score}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {result.data.reason}
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default SpamDetection;