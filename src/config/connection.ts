import knex from 'knex';

const connection = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',            // Substitua pelo seu usuário
    password: '123',             // Senha do Banco de Dados
    database: 'TrabalhoBackend', // Nome do Banco de Dados
    port: 5432,
  },
});

export default connection;