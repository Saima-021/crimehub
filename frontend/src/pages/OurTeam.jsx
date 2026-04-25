import { useState } from "react";

const OurTeam = () => {
  const [showTeam, setShowTeam] = useState(false);

  return (
    <div className="container mt-4">

      {/* Button */}
      <div className="text-center mb-4">
        <button
          className="btn btn-primary fw-bold"
          onClick={() => setShowTeam(!showTeam)}
        >
          {showTeam ? "Hide Team" : "Our Team"}
        </button>
      </div>

      {/* Team Cards */}
      {showTeam && (
        <div className="row justify-content-center">

          {/* Member 1 */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 text-center p-3">
              <img
                src="/team1.jpeg"   // put image in public folder
                alt="Developer 1"
                className="rounded-circle mx-auto"
                width="120"
                height="120"
              />
              <div className="card-body">
                <h5 className="fw-bold mt-3">DADHIWALA SAIMA AHMED</h5>
                <p className="text-muted">Developer</p>
              </div>
            </div>
          </div>

          {/* Member 2 */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 text-center p-3">
              <img
                src="/team2.jpeg"
                alt="Developer 2"
                className="rounded-circle mx-auto"
                width="120"
                height="120"
              />
              <div className="card-body">
                <h5 className="fw-bold mt-3">JAISWAR NEHA HIRALAL</h5>
                <p className="text-muted">Developer</p>
              </div>
            </div>
          </div>

          {/* Member 3 */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 text-center p-3">
              <img
                src="/team3.jpeg"
                alt="Developer 3"
                className="rounded-circle mx-auto"
                width="120"
                height="120"
              />
              <div className="card-body">
                <h5 className="fw-bold mt-3">SHAIKH FAIZUL RAHIM</h5>
                <p className="text-muted">Developer</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default OurTeam;