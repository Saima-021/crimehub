import { lazy, useState } from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

const Contact = lazy(() => import("./Contact"));
const Awareness = lazy(() => import("./Awareness"));
const OurTeam = lazy(() => import("./OurTeam"));
function Home() {
const [activeIndex, setActiveIndex] = useState(null);
const navigate = useNavigate();

  const crimes = [
    {
      title: "Online Fraud",
      description:
        "Online fraud involves scams conducted through internet platforms to steal money or personal information."
    },
    {
      title: "Identity Theft",
      description:
        "Identity theft occurs when someone steals your personal information to commit fraud or other crimes."
    },
    {
      title: "Cyber Harassment / Bullying",
      description:
        "Cyber harassment involves threatening or bullying someone using digital platforms."
    },
    {
      title: "Phishing / Scam",
      description:
        "Phishing scams trick individuals into revealing sensitive information via fake emails or websites."
    },
    {
      title: "Social Media Crime",
      description:
        "Criminal activities conducted through social media platforms."
    },
    {
      title: "Financial Fraud",
      description:
        "Financial fraud includes illegal activities intended to steal money or financial assets."
    },
    {
      title: "Hacking / Account Takeover",
      description:
        "Unauthorized access to someone’s account or system to misuse data."
    },
    {
      title: "Fake Profile / Impersonation",
      description:
        "Creating fake identities online to deceive or exploit others."
    }
  ];

  // ✅ Scroll & Highlight Function
  const handleExploreClick = () => {
    const section = document.getElementById("crimeSection");


    section.classList.add("highlight-section");

    setTimeout(() => {
      section.classList.remove("highlight-section");
    }, 25500);
  };

  return (
    <div className="home">

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section d-flex align-items-center text-center text-light position-relative">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="video2.mp4" type="video/mp4" />
        </video>

        <div className="overlay"></div>

        <div className="container position-relative">
          <h1 className="display-4 fw-bold mb-3">
            Report Cyber Crime Safely & Securely
          </h1>
          <p className="lead mb-4">
            Your security is our priority. Submit complaints easily and securely.
          </p>

          <button
            className="btn btn-primary btn-lg px-4"
            onClick={handleExploreClick}
          >
            Explore Services
          </button>
        </div>
      </section>

      <section
        id="crimeSection"
        className="crime-section position-relative"
      >
        <div className="container">
          <div className="row g-4">

            {crimes.map((crime, index) => (
              <div className="col-md-4 col-lg-3" key={index}>
                <div
                  className={`crime-card ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <h6 className="fw-bold text-center">{crime.title}</h6>

                  {activeIndex === index && (
                    <div className="crime-details mt-3 text-center">
                      <p>{crime.description}</p>

                      <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/login");
                        }}
                      >
                        Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= INFO SECTION ================= */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">Why Choose CrimeHub?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5>Secure Reporting</h5>
              <p>Your data is encrypted and protected.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h5>Fast Processing</h5>
              <p>Quick complaint submission and tracking.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h5>24/7 Support</h5>
              <p>We are available anytime to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AWARENESS ================= */}
      <section id="awareness" className="py-0">
        <Awareness />
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="pb-0 bg-light">
        <Contact />
      </section>

      <section className="pb-5 bg-light">
          <OurTeam />
      </section>
    </div>
  );
}

export default Home;