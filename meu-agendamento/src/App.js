import React, { useState } from "react";

const bookedDates = ["2025-09-05", "2025-09-06", "2025-09-08"];

function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [suggestedDate, setSuggestedDate] = useState(null);
  const [message, setMessage] = useState("");

  const findBestDate = (date) => {
    let newDate = new Date(date);
    for (let i = 0; i < 30; i++) {
      const formattedDate = newDate.toISOString().split("T")[0];
      if (!bookedDates.includes(formattedDate)) {
        return formattedDate;
      }
      newDate.setDate(newDate.getDate() + 1);
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setMessage("Por favor, selecione uma data.");
      return;
    }

    if (!bookedDates.includes(selectedDate)) {
      setSuggestedDate(selectedDate);
      setMessage("✅ Data disponível! Agendamento confirmado.");
    } else {
      const bestDate = findBestDate(selectedDate);
      if (bestDate) {
        setSuggestedDate(bestDate);
        setMessage(`⚠️ A data escolhida está ocupada. Melhor data disponível: ${bestDate}`);
      } else {
        setMessage("❌ Não há datas disponíveis nos próximos 30 dias.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚡ Agendamento Inteligente</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Escolha sua data preferida:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Verificar Disponibilidade
        </button>
      </form>

      {message && (
        <div style={styles.result}>
          <p>{message}</p>
          {suggestedDate && <strong>📅 Data sugerida: {suggestedDate}</strong>}
        </div>
      )}

      <div style={styles.bookedDates}>
        <h3 style={styles.subtitle}>Datas já ocupadas (simuladas):</h3>
        <ul>
          {bookedDates.map((date) => (
            <li key={date} style={styles.listItem}>{date}</li>
          ))}
        </ul>
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
};

export default App;
