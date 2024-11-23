var sqlite3 = require('sqlite3');
function createDatabase() {
    var newdb = new sqlite3.Database('user.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}
function createTables(newdb) {
    newdb.exec(`
    create table user (
        user text primary key not null,
        password text not null,
        subscribed int
    );
    insert into user (user,password,subscribed)
        values ('David','David!',0),
               ('John','Cena',0);
        `
    );
}

createDatabase()