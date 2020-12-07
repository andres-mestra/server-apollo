## Construyendo Api GraphQL full
Api para blog basada en [GraphQL](https://graphql.org/) utilizando:
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
* [Express.js](https://expressjs.com/)
* [Apollo-server-express](https://github.com/apollographql/apollo-server/tree/main/packages/apollo-server-express)
* [Sequelize](https://sequelize.org/)
* [PostgresQL](https://www.postgresql.org/)

Se implementa:

* Autenticación con [Json Web Tokens](https://jwt.io/)
* Permisos mediante [directivas](https://www.graphql-tools.com/docs/schema-directives/)
* Solución del problema N+1 con [dataloader.js](https://github.com/graphql/dataloader)
* Modularización de tipos y solucionadores de graphql con [GraphQL-Tools](https://www.graphql-tools.com/)
* Scalares personalizados
* La  filosofia GraphQL en las busquedas de SQL para obtener solo lo que se solicita.
