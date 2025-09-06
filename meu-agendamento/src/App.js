import React, { useState, useEffect } from "react";

const initialAppointments = {
  "2025-09-05": "Ana",
  "2025-09-06": "Bruno",
  "2025-09-08": "Carlos",
};

function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [suggestedDate, setSuggestedDate] = useState(null);
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("appointments");
    return saved ? JSON.parse(saved) : initialAppointments;
  });
  const [showModal, setShowModal] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    let user = localStorage.getItem("currentUser");
    if (!user) {
      user = prompt("Enter your name:");
      localStorage.setItem("currentUser", user);
    }
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const bfsFindDate = (startDate) => {
    const queue = [new Date(startDate)];
    const visited = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      const formatted = current.toISOString().split("T")[0];

      if (!appointments[formatted]) {
        return formatted;
      }

      visited.add(formatted);

      const next = new Date(current);
      next.setDate(next.getDate() + 1);
      if (!visited.has(next.toISOString().split("T")[0])) {
        queue.push(next);
      }

      const prev = new Date(current);
      prev.setDate(prev.getDate() - 1);
      if (!visited.has(prev.toISOString().split("T")[0])) {
        queue.push(prev);
      }
    }
    return null;
  };

  const confirmAppointment = () => {
    setAppointments((prev) => ({
      ...prev,
      [pendingDate]: currentUser,
    }));
    setMessage(`✅ ${currentUser}, your appointment is confirmed for ${pendingDate}`);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setMessage("Please select a date.");
      return;
    }

    if (!appointments[selectedDate]) {
      setPendingDate(selectedDate);
      setShowModal(true);
    } else {
      const bestDate = bfsFindDate(selectedDate);
      if (bestDate) {
        setSuggestedDate(bestDate);
        setMessage(
          `⚠️ The selected date is already taken by ${appointments[selectedDate]}. Best available date: ${bestDate}`
        );
      } else {
        setMessage("❌ No available dates.");
      }
    }
  };

  const swapAppointments = (date1, date2) => {
    if (!appointments[date1] || !appointments[date2]) {
      setMessage("❌ Both dates must be booked to swap.");
      return;
    }

    if (appointments[date1] !== currentUser && appointments[date2] !== currentUser) {
      setMessage("❌ You can only swap if you are part of the swap.");
      return;
    }

    const temp = appointments[date1];
    setAppointments((prev) => ({
      ...prev,
      [date1]: prev[date2],
      [date2]: temp,
    }));
    setMessage(`🔄 Swap done between ${appointments[date1]} and ${appointments[date2]}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ Smart Scheduling (BFS + Swap)</h1>
      <p>👤 Current user: <strong>{currentUser}</strong></p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Choose your preferred date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Check Availability
        </button>
      </form>

      {message && (
        <div style={styles.result}>
          <p>{message}</p>
          {suggestedDate && <strong>📅 Suggested date: {suggestedDate}</strong>}
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Confirm Appointment</h3>
            <p>{currentUser}, do you want to confirm {pendingDate}?</p>
            <div style={{ marginTop: "15px" }}>
              <button style={styles.button} onClick={confirmAppointment}>
                Confirm
              </button>
              <button
                style={{ ...styles.button, background: "gray" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.bookedDates}>
        <h3 style={styles.subtitle}>Current appointments:</h3>
        <ul>
          {Object.entries(appointments).map(([date, person]) => (
            <li key={date} style={styles.listItem}>
              {date} → {person}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.swapBox}>
        <h3 style={styles.subtitle}>Simulate swap:</h3>
        <button
          style={styles.button}
          onClick={() => swapAppointments("2025-09-05", "2025-09-06")}
        >
          Try swap (05/09) ↔ (06/09)
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "600px",
    margin: "50px auto",
    padding: "25px",
    borderRadius: "16px",
    background: "linear-gradient(145deg, #1e1e2f, #2a2a40)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    color: "#f0f0f0",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #00e5ff, #7c4dff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "20px",
  },
  subtitle: {
    color: "#00e5ff",
  },
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: "16px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #555",
    backgroundColor: "#1e1e2f",
    color: "#f0f0f0",
    width: "70%",
    textAlign: "center",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    padding: "12px 25px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(90deg, #00e5ff, #7c4dff)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    margin: "5px",
  },
  result: {
    marginTop: "25px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#2d2d44",
    border: "1px solid #444",
  },
  bookedDates: {
    marginTop: "30px",
    textAlign: "left",
    backgroundColor: "#1e1e2f",
    padding: "15px",
    borderRadius: "8px",
  },
  listItem: {
    margin: "5px 0",
    color: "#ccc",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#2d2d44",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  swapBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#222",
    borderRadius: "8px",
  },
};

export default App;
