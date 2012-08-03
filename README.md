# sqlite-wrapper
A small wrapper on [node-sqlite3](https://github.com/developmentseed/node-sqlite3) providing simple bindings to most commonly used SQLite functions in standard applications.

## Installation

    npm install sqlite-wrapper

## Usage

    var db = require('sqlite-wrapper')('/tmp/foo.db');

### Creating tables

    var tableName = 'people';

    db.createTable(tableName, {
            'id': {
                type: 'INTEGER',
                primary: true,
                notnull: true
            },
            'name': {
                type: 'TEXT',
                notnull: true,
                unique: true,
                default: "'John Doe'"
            },
            'city_id': {
                type: 'INTEGER',
                notnull: true,
                ref: 'cities'
            }
        }, callback);

### Basic CRUD

    // Single insertion
    db.insert(tableName, {
            name: 'Donald Knuth',
            city_id: 42
        }, callback);

    // Multiple inserts (bulk)
    db.insertAll(tableName, [
            { name: 'Dennis Richie', city_id: 23 },
            { name: 'Bjarne Stoustrup', city_id: 347 }
        ], callback);

    // Update
    db.update(tableName, 'name=?', ['Donald Knuth'], {city_id: 378 }, callback);

    // Remove
    db.remove(tableName, 'city_id=?', ['666'], callback);

    // Select
    db.select(tableName, 
        {'cities': 'cities.id=people.city_id' },
        { 'cities.name': 'city_name', 'people.name': 'person_name' },
        'people.id IS NOT NULL',
        null,
        callback,
        'people.name DESC',
        100,
        false
    );

    // Select with single result
    db.selectOne(tableName,
        null,
        ['name'],
        'name LIKE ?',
        ['%Donald%'],
        callback
    );

### Shortcut method (common tasks)

    // Find by id
    db.find(tableName, 3, callback);

    // List all elements in table
    db.list(tableName, callback);

    // Update by id
    db.updateById(tableName, 3, { city_id: 42 }, callback);
    // OR
    db.updateById(tableName, { id: 3, city_id: 42 }, callback);

    // Remove by id
    db.removeById(tableName, 3, callback);