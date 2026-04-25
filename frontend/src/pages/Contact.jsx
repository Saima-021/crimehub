import { useState } from "react";

function ContactUs() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been submitted successfully.");
  };

  return (
    <div style={{ background: "white", minHeight: "100vh", color: "#fff" }}>

      <div className="container py-5 text-center">
        <p className="lead">
          If you have any queries or need help regarding cyber crime reporting.
        </p>
      </div>

      <div className="container pb-5">
        <div className="row g-4 text-center">

          <div className="col-md-4">
            <div className="bg-dark p-4 rounded shadow">
              <h5 className="text-primary">Cyber Crime Helpline</h5>
              <p className="mt-2">Call immediately if you face cyber fraud.</p>
              <h4>1930</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="bg-dark p-4 rounded shadow">
              <h5 className="text-primary">Email Support</h5>
              <p className="mt-2">Reach us through email for assistance.</p>
              <p>support@crimehub.com</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="bg-dark p-4 rounded shadow">
              <h5 className="text-primary">Working Hours</h5>
              <p className="mt-2">Cyber support available 24/7.</p>
              <p>All Days Available</p>
            </div>
          </div>

        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">

          <div className="col-md-6">

            <div className="bg-dark p-4 rounded shadow">

              <h3 className="text-center text-primary mb-4">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    className="form-control"
                    placeholder="Write your message here"
                    onChange={handleChange}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100 fw-bold">
                  Send Message
                </button>

              </form>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default ContactUs;