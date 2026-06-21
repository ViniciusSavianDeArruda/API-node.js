import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Node Estudos",
      version: "1.0.0",
      description: "Documentação da API com OpenAPI",
    },

    servers: [
      {
        url: "http://localhost:3333",
      },
    ],

    // definindo o esquema de segurança para autenticação com JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options); // gerando a documentação da API com base nas opções definidas e nos arquivos de rotas que contêm as anotações do OpenAPI

export default specs;
