# Documentación API

## Endpoints
### /user
- GET /user - Devuelve todos los usuarios de la base de datos
- GET /user/:id - Devuelve el usuario con el id especificado
- POST /user - Crea un nuevo usuario
- PUT /user/:id - Actualiza el usuario con el id especificado
- DELETE /user/:id - Elimina el usuario con el id especificado

### /resolution
- GET /resolution - Devuelve todas las resoluciones de la base de datos
- GET /resolution/:id - Devuelve la resolución con el id especificado
- POST /resolution - Crea una nueva resolución
- PUT /resolution/:id - Actualiza la resolución con el id especificado
- DELETE /resolution/:id - Elimina la resolución con el id especificado

### /ticket
- GET /ticket - Devuelve todos los tickets de la base de datos
- GET /ticket/:id - Devuelve el ticket con el id especificado
- POST /ticket - Crea un nuevo ticket
- PUT /ticket/:id - Actualiza el ticket con el id especificado
- DELETE /ticket/:id - Elimina el ticket con el id especificado

### /ticketuser (Relación entre ticket y user para saber quien ha creado el ticket)
- GET /ticketuser - Devuelve todos los tickets-user de la base de datos
- GET /ticketuser/:id - Devuelve el ticket-user con el id especificado
- POST /ticketuser - Crea un nuevo ticket-user
- PUT /ticketuser/:id - Actualiza el ticket-user con el id especificado
- DELETE /ticketuser/:id - Elimina el ticket-user con el id especificado

### /classification
- GET /classification - Devuelve todas las clasificaciones de la base de datos
- GET /classification/:id - Devuelve la clasificación con el id especificado
- POST /classification - Crea una nueva clasificación
- PUT /classification/:id - Actualiza la clasificación con el id especificado
- DELETE /classification/:id - Elimina la clasificación con el id especificado

### /phone (Para enviar y recibir WhatsApps)
- POST /phone/confirm - Enviar confirmación de alta de teléfono para recibir WhatsApps
- POST /phone/ticket - Recibir WhatsApps de tickets y crearlos en la base de datos