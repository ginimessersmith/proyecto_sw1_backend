
#  API de Chat Multilingüe

Este proyecto es la API backend (construida en **Node.js**) para una plataforma de comunicación empresarial diseñada para romper las barreras del idioma. La lógica de negocio está centrada en un modelo B2B (Business-to-Business), permitiendo a las empresas suscribirse, administrar cuentas para sus empleados y facilitar la comunicación fluida entre usuarios que hablan diferentes idiomas.

El núcleo del sistema es su capacidad de traducción en tiempo real, manejando tanto **Texto-a-Texto** como **Audio-a-Audio**, asegurando que dos usuarios puedan chatear con normalidad, cada uno en su idioma nativo, mientras el backend gestiona toda la traducción de forma transparente.

##  Características Principales

* **Gestión de Empresas (B2B):** Las empresas pueden registrarse y obtener una suscripción (manejado por Stripe).
* **Gestión de Empleados:** Las empresas pueden crear, actualizar y eliminar cuentas para sus empleados, asignando el idioma nativo de cada uno.
* **Autenticación y Autorización:** Sistema seguro basado en JSON Web Tokens (JWT) para proteger las rutas.
* **Traducción Texto-a-Texto:** Utilizando la **API de OpenAI**, los mensajes de chat de texto se traducen instantáneamente al idioma del destinatario.
* **Traducción Audio-a-Audio:** Un flujo completo para la comunicación por voz:
    1.  **Google Speech-to-Text:** Convierte el audio de voz del emisor a texto.
    2.  **Traducción (OpenAI):** Traduce ese texto al idioma del receptor.
    3.  **Google Text-to-Speech:** Convierte el texto traducido de nuevo a un archivo de audio en el idioma del receptor.
* **Almacenamiento de Medios:** Integración con **Cloudinary** para almacenar de forma eficiente los archivos de audio generados, guardando solo las URL en la base de datos.
* **Gestión de Pagos:** Integración con **Stripe** para manejar las suscripciones de las empresas.
* **Base de Datos:** Persistencia de datos (empresas, usuarios, chats) manejada con **PostgreSQL** y el ORM **Sequelize**.

##  Pila Tecnológica (Tech Stack)

* **Backend:** Node.js, Express
* **Base de Datos:** PostgreSQL
* **ORM:** Sequelize
* **Traducción de Texto:** OpenAI API
* **Traducción de Audio:** Google Cloud Speech-to-Text y Google Cloud Text-to-Speech
* **Almacenamiento de Archivos:** Cloudinary
* **Pagos:** Stripe
* **Autenticación:** JWT (JSON Web Tokens)
* **Notificaciones/Email:** Nodemailer (para emails transaccionales)

---

## Instalación y Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### 1. Prerrequisitos

* Node.js (v18 o superior)
* PostgreSQL (una instancia local o en la nube)
* Tener cuentas y claves de API para:
    * OpenAI
    * Google Cloud Platform (con STT y TTS activados)
    * Cloudinary
    * Stripe
    * Una cuenta de Gmail (para Nodemailer, si se usa `PASS_GOOGLE`)

### 2. Clonar el Repositorio

```bash
git clone [https://github.com/ginimessersmith/proyecto_sw1_backend]
cd proyecto_sw1_backend
```

# 3. Instalar Dependencias
```bash
npm install
```
# 4. Configurar Variables de Entorno
Crea un archivo .env en la raíz del proyecto y copia el contenido del archivo .env.example. Luego, rellena las variables con tus propias claves.

.env.example

**BASE DE DATOS (PostgreSQL + Sequelize)**
*  DB_NAME=tu_base_de_datos
* DB_USERNAME=tu_usuario_db
* DB_PASSWORD=tu_contraseña_db
* DB_HOST=localhost

**CLOUDINARY (Almacenamiento de Audio)**
* CLOUDINARY_URL=tu_cloudinary_url
* CLOUDINARY_CLOUD_NAME=tu_cloud_name
* CLOUDINARY_API_KEY=tu_api_key
* CLOUDINARY_API_SECRET=tu_api_secret

**GOOGLE (Nodemailer para Emails)**
* EMAIL_GOOGLE = tu_email@gmail.com
* PASS_GOOGLE=tu_contraseña_de_app_gmail 

**STRIPE (Pagos y Suscripciones B2B)**
* STRIPE_KEY=sk_test_tu_clave_secreta_stripe
* STRIPE_SUCCESS_URL=http://localhost:4200/payment-success
* STRIPE_CANCEL_URL=http://localhost:4200/payment-cancel

**AUTENTICACIÓN (JWT)**
* SECRETORPRIVATEKEY=tu_frase_secreta_super_larga_para_jwt

**GOOGLE CLOUD (Speech-to-Text / Text-to-Speech)**
**Ruta al archivo JSON de credenciales de servicio de Google Cloud**
* GOOGLE_APPLICATION_CREDENTIALS="./tu-archivo-gcloud.json"

**OPENAI (Traducción de Texto)**
* API_OPENAI=sk-tu_clave_secreta_de_openai
* Nota Importante sobre GOOGLE_APPLICATION_CREDENTIALS: Debes descargar el archivo JSON de tu cuenta de servicio de Google Cloud y guardarlo en la raíz del proyecto (o donde indiques en la variable) con el nombre que definas (ej. sw1.json).

# 5. Iniciar el Servidor

**Modo desarrollo**
```bash
npm run dev
```
**Modo producción**
```bash
npm run start
```
El servidor estará corriendo en http://localhost:3000 (o el puerto del env PORT).

# 6. Estructura del Proyecto
La estructura del proyecto está organizada de la siguiente manera, basada en las carpetas principales:
```bash
/
├── app.js          # Archivo de entrada principal (Servidor de Express)
├── controllers/    # Lógica de negocio y control de rutas (request/response)
├── database/       # Configuración de la conexión a la base de datos (Sequelize)
├── helpers/        # Funciones de utilidad (ej. JWT, wrappers de Google/OpenAI, Cloudinary)
├── middlewares/    # Middlewares personalizados (ej. validar-jwt, validar-roles)
├── models/         # Modelos de la base de datos (Definiciones de Sequelize)
├── paths/          # (Opcional: describe esta carpeta, ej: "Constantes de rutas")
├── public/         # Carpeta para archivos estáticos
├── routes/         # Definición de las rutas de la API (Endpoints)
├── .env.example    # Plantilla de variables de entorno
├── .gitignore      # Archivos ignorados por Git
├── package.json    # Dependencias y scripts del proyecto
└── README.md       # 
```
