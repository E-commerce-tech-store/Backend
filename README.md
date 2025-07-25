# Documentación del Backend - E-commerce Tech Store

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura y Tecnologías](#arquitectura-y-tecnologías)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Base de Datos](#base-de-datos)
5. [Módulos de la Aplicación](#módulos-de-la-aplicación)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [API Endpoints](#api-endpoints)
8. [Configuración del Entorno](#configuración-del-entorno)
9. [Scripts Disponibles](#scripts-disponibles)
10. [Testing](#testing)
11. [Despliegue](#despliegue)

## Descripción General

Este proyecto es el backend de una aplicación de e-commerce desarrollada con **NestJS**, utilizando **PostgreSQL** como base de datos y **Prisma** como ORM. La aplicación proporciona una API REST completa para la gestión de productos, categorías, usuarios, autenticación y órdenes de compra.

### Características Principales

- **Autenticación JWT** con roles de usuario (ADMIN, USER)
- **CRUD completo** para productos, categorías, usuarios y órdenes
- **Sistema de roles** y autorización
- **Validación de datos** con class-validator
- **Manejo global de excepciones**
- **Documentación de API** con archivos REST
- **Testing** unitario e integración

## Arquitectura y Tecnologías

### Framework Principal

- **NestJS** v11.0.1 - Framework de Node.js para aplicaciones escalables del lado del servidor

### Base de Datos y ORM

- **PostgreSQL** - Base de datos relacional
- **Prisma** v6.12.0 - ORM moderno para TypeScript y Node.js

### Autenticación y Seguridad

- **JWT (JSON Web Tokens)** - Para autenticación stateless
- **Passport.js** - Middleware de autenticación
- **bcrypt** - Para hashing de contraseñas

### Validación y Transformación

- **class-validator** - Validación basada en decoradores
- **class-transformer** - Transformación de objetos

### Testing

- **Jest** - Framework de testing
- **Supertest** - Testing de HTTP

### Desarrollo

- **TypeScript** - Superset tipado de JavaScript
- **ESLint** - Linter para mantener código consistente
- **Prettier** - Formateador de código

## Estructura del Proyecto

```
backend/
├── docs/                          # Documentación de API (archivos REST)
│   ├── auth.rest                  # Endpoints de autenticación
│   ├── category.rest              # Endpoints de categorías
│   ├── orders.rest                # Endpoints de órdenes
│   ├── product.rest               # Endpoints de productos
│   └── users.rest                 # Endpoints de usuarios
├── prisma/                        # Configuración de Prisma
│   ├── schema.prisma              # Schema de la base de datos
│   └── migrations/                # Migraciones de base de datos
├── scripts/                       # Scripts SQL y datos de prueba
│   ├── main.sql                   # Scripts SQL principales
│   └── tbl_categories_rows.csv    # Datos de categorías
├── src/                           # Código fuente principal
│   ├── auth/                      # Módulo de autenticación
│   │   ├── decorators/            # Decoradores personalizados
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── entities/              # Entidades
│   │   ├── guards/                # Guards de autenticación y autorización
│   │   ├── interfaces/            # Interfaces TypeScript
│   │   └── strategies/            # Estrategias de Passport
│   ├── categories/                # Módulo de categorías
│   │   ├── dto/                   # DTOs para categorías
│   │   └── entities/              # Entidades de categorías
│   ├── config/                    # Configuración de la aplicación
│   │   └── env.ts                 # Variables de entorno
│   ├── generated/                 # Código generado por Prisma
│   │   └── prisma/                # Cliente de Prisma generado
│   ├── interceptor/               # Interceptores globales
│   ├── orders/                    # Módulo de órdenes
│   │   ├── dto/                   # DTOs para órdenes
│   │   └── entities/              # Entidades de órdenes
│   ├── products/                  # Módulo de productos
│   │   ├── dto/                   # DTOs para productos
│   │   └── entities/              # Entidades de productos
│   ├── shared/                    # Código compartido
│   │   ├── types/                 # Tipos TypeScript compartidos
│   │   └── utils/                 # Utilidades
│   ├── users/                     # Módulo de usuarios
│   │   ├── dto/                   # DTOs para usuarios
│   │   └── entities/              # Entidades de usuarios
│   ├── app.controller.ts          # Controlador principal
│   ├── app.module.ts              # Módulo principal de la aplicación
│   ├── app.service.ts             # Servicio principal
│   ├── main.ts                    # Punto de entrada de la aplicación
│   └── prisma.service.ts          # Servicio de Prisma
├── test/                          # Tests e2e
└── Dockerfile                     # Configuración de Docker
```

## Base de Datos

### Modelo de Datos

La aplicación utiliza las siguientes tablas principales:

#### tbl_user

- **id**: UUID (Primary Key)
- **email**: String único
- **name**: String
- **password**: String (hasheada)
- **role**: Enum (ADMIN, USER)
- **status**: Boolean (activo/inactivo)
- **created_at**: Timestamp

#### tbl_categories

- **id**: UUID (Primary Key)
- **name**: String único
- **description**: String opcional
- **status**: Boolean
- **created_at**: Timestamp

#### tbl_products

- **id**: UUID (Primary Key)
- **category_id**: UUID (Foreign Key)
- **name**: String
- **description**: String
- **price**: Decimal
- **stock**: Decimal
- **image_url**: String
- **status**: Boolean
- **created_at**: Timestamp

#### tbl_orders

- **id**: UUID (Primary Key)
- **id_user**: UUID (Foreign Key)
- **total**: Decimal
- **status**: Enum (PENDING, FINISHED, CANCELLED)
- **created_at**: Timestamp

#### tbl_order_details

- **id**: UUID (Primary Key)
- **id_order**: UUID (Foreign Key)
- **id_product**: UUID (Foreign Key)
- **quantity**: Decimal
- **current_price**: Decimal
- **subtotal**: Decimal
- **created_at**: Timestamp

### Relaciones

- Un usuario puede tener múltiples órdenes
- Una orden puede tener múltiples detalles de orden
- Un producto pertenece a una categoría
- Una categoría puede tener múltiples productos

## Módulos de la Aplicación

### AuthModule

**Responsabilidad**: Maneja la autenticación y autorización de usuarios

**Componentes**:

- `AuthController`: Endpoints para registro, login y perfil
- `AuthService`: Lógica de negocio para autenticación
- `JwtStrategy`: Estrategia de Passport para JWT
- `JwtAuthGuard`: Guard para proteger rutas
- `RolesGuard`: Guard para autorización basada en roles

**DTOs**:

- `RegisterDto`: Datos para registro de usuario
- `LoginDto`: Datos para inicio de sesión
- `UpdateUserDto`: Datos para actualización de perfil

### CategoriesModule

**Responsabilidad**: Gestión de categorías de productos

**Funcionalidades**:

- CRUD completo de categorías
- Listado de categorías con conteo de productos
- Validación de datos de entrada
- Autorización por roles (ADMIN para modificaciones)

### ProductsModule

**Responsabilidad**: Gestión del catálogo de productos

**Funcionalidades**:

- CRUD completo de productos
- Filtrado y búsqueda de productos
- Gestión de stock
- Validación de datos de entrada

### OrdersModule

**Responsabilidad**: Gestión de órdenes de compra

**Funcionalidades**:

- Creación de órdenes
- Seguimiento de estado de órdenes
- Historial de órdenes por usuario
- Cálculo automático de totales

### UsersModule

**Responsabilidad**: Gestión de usuarios del sistema

**Funcionalidades**:

- CRUD de usuarios (solo ADMIN)
- Estadísticas de usuarios
- Historial de órdenes por usuario
- Gestión de roles y estados

## Sistema de Autenticación

### Flujo de Autenticación

1. **Registro**: El usuario se registra con email, nombre y contraseña
2. **Login**: El usuario inicia sesión y recibe un JWT token
3. **Autorización**: El token se incluye en las peticiones como Bearer token
4. **Validación**: Cada request protegido valida el token JWT

### Roles de Usuario

- **USER**: Usuario estándar que puede realizar compras
- **ADMIN**: Administrador con permisos para gestionar productos, categorías y usuarios

### Guards Implementados

- **JwtAuthGuard**: Valida tokens JWT en rutas protegidas
- **RolesGuard**: Verifica que el usuario tenga el rol requerido

### Decoradores Personalizados

- `@Public()`: Marca rutas como públicas (sin autenticación)
- `@Roles()`: Define roles requeridos para acceder a una ruta
- `@GetUser()`: Extrae información del usuario del token JWT

## API Endpoints

### Autenticación (/api/auth)

- `POST /register` - Registro de usuario
- `POST /login` - Inicio de sesión
- `GET /profile` - Obtener perfil del usuario autenticado
- `PUT /profile` - Actualizar perfil del usuario

### Productos (/api/products)

- `GET /` - Listar todos los productos (público)
- `GET /:id` - Obtener producto por ID (público)
- `POST /` - Crear producto (ADMIN)
- `PATCH /:id` - Actualizar producto (ADMIN)
- `DELETE /:id` - Eliminar producto (ADMIN)

### Categorías (/api/categories)

- `GET /` - Listar todas las categorías (público)
- `GET /with-count` - Categorías con conteo de productos (público)
- `GET /:id` - Obtener categoría por ID (público)
- `POST /` - Crear categoría (ADMIN)
- `PUT /:id` - Actualizar categoría (ADMIN)
- `DELETE /:id` - Eliminar categoría (ADMIN)

### Órdenes (/api/orders)

- `POST /` - Crear nueva orden
- `GET /` - Listar órdenes del usuario o todas (ADMIN)
- `GET /:id` - Obtener orden por ID
- `PATCH /:id` - Actualizar estado de orden
- `DELETE /:id` - Cancelar orden

### Usuarios (/api/users) - Solo ADMIN

- `GET /` - Listar todos los usuarios
- `GET /stats` - Estadísticas de usuarios
- `GET /:id` - Obtener usuario por ID
- `GET /:id/orders` - Historial de órdenes del usuario
- `POST /` - Crear usuario
- `PATCH /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario

## Configuración del Entorno

### Variables de Entorno Requeridas

Crear un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=8080

# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="tu_jwt_secret_muy_seguro"

# Entorno
NODE_ENV="development"
```

### Variables de Entorno de Producción

Para producción, crear `.env.production`:

```env
PORT=8080
DATABASE_URL="postgresql://usuario:password@host:5432/ecommerce_prod"
JWT_SECRET="jwt_secret_production_muy_seguro"
NODE_ENV="production"
```

## Scripts Disponibles

### Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo con watch
npm run start:dev

# Modo debug
npm run start:debug
```

### Construcción y Producción

```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

### Base de Datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Reset de base de datos
npx prisma migrate reset

# Visualizar datos (Prisma Studio)
npx prisma studio
```

### Testing

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Linting y Formateo

```bash
# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

## Testing

### Estructura de Tests

- **Unitarios**: Tests de servicios y controladores individuales
- **Integración**: Tests e2e que prueban flujos completos
- **Mocking**: Uso de mocks para dependencias externas

### Archivos de Test

- `*.spec.ts`: Tests unitarios
- `*.e2e-spec.ts`: Tests de integración
- `jest.config.js`: Configuración de Jest

### Cobertura de Código

El proyecto está configurado para generar reportes de cobertura de código usando Jest.

## Despliegue

### Docker

El proyecto incluye un `Dockerfile` para contenerización:

```bash
# Construir imagen
docker build -t ecommerce-backend .

# Ejecutar contenedor
docker run -p 8080:8080 ecommerce-backend
```

### Variables de Entorno para Producción

- Configurar `DATABASE_URL` con la conexión a PostgreSQL de producción
- Usar un `JWT_SECRET` fuerte y único
- Configurar `NODE_ENV=production`

### Consideraciones de Seguridad

- Usar HTTPS en producción
- Configurar CORS apropiadamente
- Implementar rate limiting
- Validar todas las entradas de usuario
- Mantener dependencias actualizadas

## Desarrollo y Contribución

### Estándares de Código

- Usar TypeScript para tipado estático
- Seguir las convenciones de NestJS
- Documentar funciones complejas
- Escribir tests para nuevas funcionalidades

### Estructura de Commits

- Usar commits descriptivos
- Seguir conventional commits
- Incluir tests en los commits

### Proceso de Desarrollo

1. Crear rama feature desde main
2. Desarrollar funcionalidad
3. Escribir/actualizar tests
4. Ejecutar linting y tests
5. Crear Pull Request
6. Code review
7. Merge a main

---

## Contacto y Soporte

Para preguntas técnicas o soporte, contactar al equipo de desarrollo.

**Última actualización**: Julio 2025
**Versión**: 0.0.1
