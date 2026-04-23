import livros from "./livrosRoutes.js";
import autores from "./autoresRoutes.js";
import favoritos from "./favoritosRoutes.js";
import googleRoutes from "./googleRoutes.js";
import calendarRoutes from "./calendarRoutes.js";
import authRoutes from "./authRoutes.js";
import booksExternalRoutes from "./booksExternalRoutes.js";
import leitura from "./leituraRoutes.js";
import teste from "./teste.js";
import databaseAvailability from "../middlewares/databaseAvailability.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send({ titulo: "Ok, aqui estamos!" });
  });

  app.route("/health").get((req, res) => {
    res.status(200).json({ ok: true });
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(teste);
  }

  app.use(booksExternalRoutes);
  app.use(
    databaseAvailability,
    authRoutes,
    livros,
    leitura,
    autores,
    favoritos,
    calendarRoutes,
    googleRoutes
  );
};

export default routes;
