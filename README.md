# Alkywall - Billetera Virtual 

Proyecto de desarrollo de una aplicación web (Billetera Virtual) que permite a los clientes realizar tareas bancarias básicas como depósitos, transferencias, almacenamiento de saldo y gestión de gastos.

## Tecnologías y Stack
Este proyecto está dividido en un backend robusto y un frontend interactivo:
*   **Backend:** Java 21, Spring Boot 4.1 (Arquitectura MVC).
*   **Base de Datos:** MySQL relacional gestionada mediante JPA / Hibernate.
*   **Seguridad:** Spring Security y autenticación stateless con tokens JWT.
*   **Frontend:** HTML5, CSS3 (puro/Modules) y JavaScript Vanilla (fetch/Axios para consumo de API).

## Flujo de Trabajo (Git Flow)
Para mantener el repositorio ordenado y evitar conflictos, el equipo trabaja bajo el siguiente esquema de ramas:
1.  **`main`**: Rama de producción. Solo contiene código estable y finalizado. **Nadie commitea directamente aquí.**
2.  **`develop`**: Rama de integración. Todo el código nuevo se fusiona aquí antes de pasar a producción.
3.  **Ramas de trabajo (`feat/`, `fix/`, `docs/`)**: Cada tarea o HU se desarrolla en una rama independiente creada a partir de `develop`.
    *   Ejemplo: `feat/ticket-39` o `feat/login-security`.
    *   Al finalizar la tarea, se abre un **Pull Request (PR)** hacia `develop` para su revisión e integración.

## Convenciones de Código
Para garantizar la legibilidad y coherencia en el código escrito por distintos desarrolladores, adoptamos las siguientes convenciones:
*   **Idioma del Dominio:** Las variables, entidades de base de datos (Ej: `Usuario`, `Cuenta`), atributos y nombres de tablas se escriben en **Español** para alinearse con el diagrama ERD.
*   **Nomenclatura de Clases:** Se utiliza *PascalCase* y se añade el sufijo del patrón de diseño en inglés (Ej: `UsuarioController`, `CuentaService`, `UsuarioRepository`).
*   **Nomenclatura de Variables y Métodos:** Se utiliza *camelCase* (Ej: `idUsuario`, `obtenerSaldo()`).
*   **DTOs:** Los objetos de transferencia de datos no exponen la entidad real y llevan el sufijo DTO (Ej: `UsuarioRequestDTO`).

## ⚙️ Instalación y Ejecución Local
1.  Clonar el repositorio: `git clone https://github.com/PsyBrainy/cfi-track-1.git`
2.  Posicionarse en la rama de desarrollo: `git checkout develop`
3.  Configurar la base de datos local (MySQL/XAMPP) creando una base vacía llamada `alkywall`.
4.  Configurar las credenciales en `src/main/resources/application.properties`.
5.  Ejecutar el proyecto en IntelliJ IDEA. Hibernate se encargará de crear las tablas automáticamente (DDL-auto).