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
      setMessage("Data disponível! Agendamento confirmado.");
    } else {
      const bestDate = findBestDate(selectedDate);
      if (bestDate) {
        setSuggestedDate(bestDate);
        setMessage(`A data escolhida está ocupada. Melhor data disponível: ${bestDate}`);
      } else {
        setMessage("Não há datas disponíveis nos próximos 30 dias.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Agendamento Inteligente</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Escolha sua data preferida:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Verificar Disponibilidade</button>
      </form>

      {message && (
        <div style={styles.result}>
          <p>{message}</p>
          {suggestedDate && <strong>Data sugerida: {suggestedDate}</strong>}
        </div>
      )}

      <div style={styles.bookedDates}>
        <h3>Datas já ocupadas (simuladas):</h3>
        <ul>
          {bookedDates.map((date) => (
            <li key={date}>{date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  title: {
    color: "#333",
  },
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "60%",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#e0f7fa",
  },
  bookedDates: {
    marginTop: "30px",
    textAlign: "left",
  },
};

export default App;
