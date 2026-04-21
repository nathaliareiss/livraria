import api from "../../servicos/api";

function Agenda() {
  async function conectarGoogle() {
    try {
      const response = await api.get("/auth/google/url");
      window.location.href = response.data.url;
    } catch (error) {
      alert("Nao foi possivel conectar ao Google Agenda");
    }
  }

  return (
    <div className="calendario">
      <button onClick={conectarGoogle}>Conectar Google Agenda</button>
    </div>
  );
}

export default Agenda;
