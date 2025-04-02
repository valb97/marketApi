# 🛒 Supermarket Backend

Este es el backend de un supermercado, desarrollado con **Node.js** y **Express**. Proporciona autenticación con tokens y funcionalidades básicas para la gestión de productos y usuarios. A futuro, se implementará un **Rate Limiter** para mejorar la seguridad y el rendimiento.

## 🚀 Tecnologías
- **Node.js**
- **Express**
- **JWT (JSON Web Token) para autenticación**
- **MongoDB / PostgreSQL (según configuración futura)**

## 🔑 Características
- Registro e inicio de sesión con **tokens JWT**.
- Gestión de productos y usuarios.
- Middleware de autenticación.
- Planificación para agregar un **Rate Limiter**.

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   ```
2. Ingresa al directorio del proyecto:
   ```bash
   cd tu-repo
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura las variables de entorno en un archivo `.env`.

## ▶️ Uso

Inicia el servidor en modo desarrollo:
```bash
npm run dev
```

O en modo producción:
```bash
npm start
```

El backend estará disponible en `http://localhost:3000` (por defecto).

## 🔒 Autenticación
El sistema utiliza **JWT** para autenticar usuarios. Para acceder a rutas protegidas, se debe incluir el token en los encabezados de la solicitud:

```
Authorization: Bearer <tu_token>
```

## 🔜 Próximas mejoras
- Implementación de **Rate Limiting** para prevenir abusos.
- Soporte para **roles y permisos**.
- Integración con una base de datos estable.

## 🤝 Contribución
Si quieres contribuir, ¡será bienvenido! Haz un **fork**, crea una rama con tu mejora y abre un PR.

---
**Desarrollado 💻 por ValentinB (https://github.com/valb97)**



