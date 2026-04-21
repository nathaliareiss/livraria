import api from "../../servicos/api";

function ConectarGoogle({ className }) {
  const conectarGoogle = async () => {
    try {
      const response = await api.get("/auth/google/url");
      window.location.href = response.data.url;
    } catch (error) {
      alert("Nao foi possivel conectar ao Google Calendar");
    }
  };

  return (
    <button className={className} onClick={conectarGoogle}>
      Conectar Google Calendar
    </button>
  );
}

export default ConectarGoogle;
