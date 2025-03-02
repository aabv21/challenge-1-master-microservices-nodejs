# challenge-1-master-microservices-nodejs
API DE TAREAS (TODO APP)

Usar Node.js, Express y MongoDB para crear una API RESTful que permita gestionar Tareas

# Tasks:

## Seguridad
hashear o encriptar las contraseñas antes de guardarlas en la base de datos
validar que las rutas estén protegidas y no sean visibles para usuarios no registrados
tampoco deben ser visibles para usuarios que no hayan iniciado sesión
evitar spam con rate limiter y técnicas de debouncing o throttling,
evitar polución en la data que se recibe en lado del servidor
Evitar envió de datos sensibles en las respuestas
Validar los datos de entrada para prevenir errores y vulnerabilidades.

## Validación y limpieza
Manejo adecuado de middlewares para validaciones, logs y errores
Evitar callbacks anidados, usar async/await
Uso correcto de Promise.allSettled() en múltiples promesas
Evitar bloqueos en el Event Loop.
Estructura modular del proyecto.
Reusabilidad de las funciones, middlewares o módulos.

## Manejo de Errores
Implementar un manejo de errores robusto para responder a los clientes con mensajes claros y útiles
enviar los status correctos.

## BONUS
puntos extras al crear un servicio de búsqueda de tareas
puntos extras al crear una papelera de reciclaje para las tareas.
