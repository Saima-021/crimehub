import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { OfficerAuthContext } from "../../context/OfficerAuthContext";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const OfficerOverview = () => {
  const { officer } = useContext(OfficerAuthContext);

  const [stats, setStats] = useState({
    totalReports: 0,
    solvedCases: 0
  });

  const [crimeChart, setCrimeChart] = useState([]);
  const [loading, setLoading] = useState(true);

  const crimeCategories = [
    "Online Fraud",
    "Identity Theft",
    "Cyber Harassment / Bullying",
    "Phishing / Scam",
    "Social Media Crime",
    "Financial Fraud",
    "Hacking / Account Takeover",
    "Fake Profile / Impersonation",
    "Other"
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("officerToken");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.post(
          "http://localhost:5000/api/officer/dashboard-stats",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.data.success) {
          setStats({
            totalReports: res.data.data.totalReports || 0,
            solvedCases: res.data.data.solvedCases || 0
          });

          setCrimeChart(res.data.data.crimeDistribution || []);
        }
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (officer) {
      fetchStats();
    }
  }, [officer]);

  const crimeMap = {};
  crimeChart.forEach((item) => {
    crimeMap[item._id] = item.count;
  });

  const chartData = {
    labels: crimeCategories,
    datasets: [
      {
        label: "Reported Cases",
        data: crimeCategories.map((cat) => crimeMap[cat] || 0),
        backgroundColor: "rgba(51,153,255,0.6)",
        borderColor: "#3399ff",
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 40
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            return label.split(" ");
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#6b7280"
        },
        grid: {
          color: "#e5e7eb"
        }
      }
    }
  };

  if (loading || !officer) {
    return (
      <div className="p-5 text-center" style={{ color: "var(--text-main)" }}>
        <div className="spinner-border spinner-border-sm me-2"></div>
        Verifying Security Credentials...
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 text-start">
          <h2 className="fw-bold" style={{ color: "var(--text-main)" }}>
            Profile
          </h2>
          <p className="text-muted small">
            Welcome back, {officer.role}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">

        <div className="col-md-6">
          <div
            className="white-page-content p-4 text-center border-0"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h6 className="text-muted small fw-bold text-uppercase">
              {officer.role === "SUPER_ADMIN"
                ? "Global Reports Received"
                : `${officer.assignedDepartment || "Unit"} Reports`}
            </h6>

            <h1
              className="display-4 fw-bold mt-2"
              style={{ color: "var(--text-main)" }}
            >
              {stats.totalReports}
            </h1>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="white-page-content p-4 text-center border-0"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h6 className="text-muted small fw-bold text-uppercase">
              Cases Successfully Solved
            </h6>

            <h1
              className="display-4 fw-bold mt-2"
              style={{ color: "#3399ff" }}
            >
              {stats.solvedCases}
            </h1>
          </div>
        </div>

      </div>

      {/* Crime Distribution Chart */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="white-page-content p-4 border-0 shadow-sm"
            style={{ backgroundColor: "var(--card-bg)" }}
          >

            <h4 className="fw-bold mb-1 text-start" style={{ color: "var(--text-main)" }}>
              Crime Distribution Analysis
            </h4>

            <p className="text-muted small mb-4">
              Real-time analytics from secure database
            </p>

            <Bar data={chartData} options={chartOptions} />

          </div>
        </div>
      </div>

      {/* Officer Profile */}
      <div className="row">
        <div className="col-12">
          <div
            className="white-page-content p-4 border-0 shadow-sm"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h4 className="fw-bold mb-4 text-start" style={{ color: "var(--text-main)" }}>
              Officer Identification
            </h4>

            <div className="row g-4 text-start">

              <div className="col-md-4">
                <label className="small fw-bold text-muted text-uppercase">
                  Full Name
                </label>

                <div className="fs-5 fw-bold" style={{ color: "var(--text-main)" }}>
                  {officer.fullName || "Not Available"}
                </div>
              </div>

              <div className="col-md-4">
                <label className="small fw-bold text-muted text-uppercase">
                  Badge Identifier
                </label>

                <div className="fs-5 fw-bold text-primary">
                  {officer.badgeNumber
                    ? `#${officer.badgeNumber}`
                    : "Pending ID"}
                </div>
              </div>

              <div className="col-md-4">
                <label className="small fw-bold text-muted text-uppercase">
                  Assigned Unit
                </label>

                <div>
                  <span className="badge bg-primary px-3 py-2 text-uppercase">
                    {officer.assignedDepartment || "General Duty"}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default OfficerOverview;