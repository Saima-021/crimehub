import React, { useState, useEffect } from "react";
import axios from "axios";

const OfficerSystemLogs = () => {

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionFilter, setActionFilter] = useState("ALL");
  const [officerFilter, setOfficerFilter] = useState("ALL");


  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("officerToken");

        // FETCH SYSTEM LOGS
        const logsRes = await axios.post(
          "http://localhost:5000/api/officer/system-logs",
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (logsRes.data.success) {
          setLogs(logsRes.data.data);
          setFilteredLogs(logsRes.data.data);
        }


        // FETCH ALL OFFICERS (FIXED ROUTE)
        const officersRes = await axios.post(
          "http://localhost:5000/api/officer/all-officers",
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (officersRes.data.success) {
          setOfficers(officersRes.data.data);
        }

      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }

    };

    fetchData();

  }, []);



  // FILTER LOGIC
  useEffect(() => {

    let updatedLogs = [...logs];

    if (actionFilter !== "ALL") {
      updatedLogs = updatedLogs.filter(log =>
        log.action.includes(actionFilter)
      );
    }

    if (officerFilter !== "ALL") {
      updatedLogs = updatedLogs.filter(log =>
        log.performer?.fullName === officerFilter
      );
    }

    setFilteredLogs(updatedLogs);

  }, [actionFilter, officerFilter, logs]);



  if (loading) {
    return (
      <div className="p-5 text-center" style={{ color: "var(--text-main)" }}>
        ACCESSING AUDIT TRAIL...
      </div>
    );
  }



  return (

    <div className="container-fluid p-0">

      {/* HEADER */}
      <div className="row mb-4">
        <div className="col-12 text-start">
          <h2 className="fw-bold" style={{ color: "var(--text-main)" }}>
            System Activity Logs
          </h2>
          <p className="text-muted">
            Security Audit: Tracking all administrative and personnel actions.
          </p>
        </div>
      </div>



      {/* FILTERS */}
      <div className="row mb-3">

        {/* ACTION FILTER */}
        <div className="col-md-3">

          <select
            className="form-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >

            <option value="ALL">All Actions</option>
            <option value="CREATE">Create Officer</option>
            <option value="EDIT">Edit Officer</option>
            <option value="DELETE">Delete Officer</option>
            <option value="SUSPEND">Suspend Officer</option>
            <option value="RESTORE">Restore Officer</option>

          </select>

        </div>



        {/* OFFICER FILTER */}
        <div className="col-md-3">

          <select
            className="form-select"
            value={officerFilter}
            onChange={(e) => setOfficerFilter(e.target.value)}
          >

            <option value="ALL">All Officers</option>

            {officers.map((officer) => (
              <option key={officer._id} value={officer.fullName}>
                {officer.fullName}
              </option>
            ))}

          </select>

        </div>

      </div>



      {/* TABLE */}
      <div className="row">
        <div className="col-12">

          <div
            className="white-page-content p-0 border-0 shadow-sm"
            style={{ backgroundColor: "var(--card-bg)" }}
          >

            <div className="table-responsive">

              <table className="table mb-0" style={{ color: "var(--text-main)" }}>

                <thead style={{ borderBottom: "2px solid var(--border-color)" }}>

                  <tr>
                    <th className="py-3 px-4 small fw-bold text-uppercase">Timestamp</th>
                    <th className="py-3 small fw-bold text-uppercase">Officer Name</th>
                    <th className="py-3 small fw-bold text-uppercase text-center">Action</th>
                    <th className="py-3 small fw-bold text-uppercase">Target</th>
                    <th className="py-3 px-4 small fw-bold text-uppercase">Details</th>
                  </tr>

                </thead>



                <tbody style={{ borderTop: "none" }}>

                  {filteredLogs.map((log) => (

                    <tr
                      key={log._id}
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        verticalAlign: "middle"
                      }}
                    >

                      {/* TIMESTAMP */}
                      <td className="px-4 py-3">

                        <div className="fw-bold">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>

                        <small className="text-muted" style={{ fontSize: "11px" }}>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </small>

                      </td>


                      {/* OFFICER NAME */}
                      <td>
                        <div className="fw-bold">
                          {log.performer?.fullName || "Unknown"}
                        </div>
                      </td>



                      {/* ACTION */}
                      <td className="text-center">

                        <span
                          className={`badge squared-pill ${
                            log.action.includes("SUSPEND")
                              ? "bg-dark"
                              : log.action.includes("RESTORE")
                              ? "bg-dark"
                              : "bg-dark"
                          }`}
                          style={{ minWidth: "110px", padding: "6px 12px" }}
                        >
                          {log.action.replace("_", " ")}
                        </span>

                      </td>



                      {/* TARGET */}
                      <td className="fw-bold">
                        {log.targetName || "SYSTEM"}
                      </td>



                      {/* DETAILS */}
                      <td className="px-4 small text-muted">
                        {log.details}
                      </td>

                    </tr>

                  ))}



                  {filteredLogs.length === 0 && (

                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted small text-uppercase">
                        No activity records found
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </div>

    </div>

  );

};

export default OfficerSystemLogs;