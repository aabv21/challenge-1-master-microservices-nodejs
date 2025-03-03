# challenge-1-master-microservices-nodejs

API DE TAREAS (TODO APP)

Usar Node.js, Express y MongoDB para crear una API RESTful que permita gestionar Tareas

# Tasks:

## Seguridad

- hashear o encriptar las contraseñas antes de guardarlas en la base de datos
- validar que las rutas estén protegidas y no sean visibles para usuarios no registrados
- evitar spam con rate limiter y técnicas de debouncing o throttling,
- evitar polución en la data que se recibe en lado del servidor
- evitar envío de datos sensibles en las respuestas
- validar los datos de entrada para prevenir errores y vulnerabilidades

## Validación y limpieza

- manejo adecuado de middlewares para validaciones, logs y errores
- evitar callbacks anidados, usar async/await
- uso correcto de Promise.allSettled() en múltiples promesas
- evitar bloqueos en el Event Loop.
- estructura modular del proyecto.
- reusabilidad de las funciones, middlewares o módulos.

## Manejo de Errores

- implementar un manejo de errores robusto para responder a los clientes con mensajes claros y útiles
- enviar los status correctos.

## BONUS

- puntos extras al crear un servicio de búsqueda de tareas
- puntos extras al crear una papelera de reciclaje para las tareas.
