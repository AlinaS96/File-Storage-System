
//These are database credentials, change them with your localmachine DB credentials
const Pool = require('pg').Pool;

const pool = new Pool({
    host:'localhost',
    port:49159,
    user:'postgres',
    password:'postgrespw',
    database:'postgres',
})

module.exports = pool;