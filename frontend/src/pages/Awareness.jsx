import { Link } from "react-router-dom";
import "../styles/awareness.css";

function Awareness() {
  return (
    <div className="awareness-page">

      <div className="container py-3 text-center fade-in">
        <h1 className="fw-bold text-primary">Cyber Safety Awareness</h1>
        <p className="lead mt-3">
          Learn how cyber criminals operate and how you can protect yourself online.
        </p>
      </div>

      <div className="container pb-5">
        <div className="row g-4">

          <div className="col-md-4">
            <div className="awareness-card">
              <h4>Phishing</h4>
              <p>
                Fraudulent emails or fake websites trick users into sharing
                sensitive data like passwords, banking information, or OTPs.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="awareness-card">
              <h4>Online Shopping Fraud</h4>
              <p>
                Fake websites advertise products at very low prices and
                disappear after receiving payment from victims.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="awareness-card">
              <h4>Identity Theft</h4>
              <p>
                Cyber criminals steal personal data such as Aadhaar,
                bank details, or email access to commit financial fraud.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center text-primary mb-4">Cyber Safety Tips</h2>

        <div className="row g-4">

          <div className="col-md-6">
            <div className="tip-card">
              <h5>Never Share OTP</h5>
              <p>
                Banks and officials never ask for OTP. Sharing OTP can allow
                criminals to access your bank account.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="tip-card">
              <h5>Use Strong Passwords</h5>
              <p>
                Always create strong passwords using letters, numbers,
                and special characters.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="tip-card">
              <h5>Avoid Public WiFi</h5>
              <p>
                Public WiFi networks are not secure and can allow hackers
                to intercept your data.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="tip-card">
              <h5>Verify Links</h5>
              <p>
                Always verify website URLs before entering login or
                payment details.
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="container py-5 text-center">
        <div className="emergency-card">
          <h3>Cyber Crime Emergency</h3>
          <p className="mt-3">
            If you are a victim of cyber fraud, immediately report it
            through the national helpline.
          </p>
          <h4 className="mt-3">Helpline: <span>1930</span></h4>
        </div>
      </div>

    </div>
  );
}

export default Awareness;