// import user from "../models/user";

//@ts-ignore
export const getReport = (_req, res) => {
    res.send("Hola esto es una prueba");
    // Usuario con más y menos tickets (aula con más y menos incidentes)

    // Tiempo promedio en el que un ticket fue resuelto (merge de ticket.resolution.closureTime y ticketUser.ineractionDate when interactionType === "create")

    // Categorías más reportadas (list all tickets in time range and count)

    // Numero de tickets activos (closure time == null), nuevos (closure time == null && ticketUser.ineractionDate when interactionType === "create" during the week), completados (closure time en la semana)

    // Inventario por aula (categoría mobiliario y materiales count de subcategorías)
};

