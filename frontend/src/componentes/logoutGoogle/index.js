import api from "../../servicos/api";

function DesconectarGoogle({ className, onDesconectado }) {
  const desconectar = async () => {
    try {
      const res = await api.delete("/auth/google");

      if (res.status >= 200 && res.status < 300) {
        alert("Google desconectado com sucesso");
        onDesconectado?.();
      }
    } catch (error) {
      alert(error.response?.data?.erro || "Nao foi possivel desconectar o Google Calendar");
    }
  };

  return (
    <button className={className} onClick={desconectar} style={{ background: "red", color: "white" }}>
      Desconectar Google Calendar
    </button>
  );
}

export default DesconectarGoogle;
