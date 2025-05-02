import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      description: "A simple products API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://blog-platform-api-1-75b3dc5ec6c8.herokuapp.com",
        description: "Production server",
      },
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./swagger/*.js"], // Adjust this path to match your Swagger comment files
};

const specs = swaggerJSDoc(options);
export default specs;
