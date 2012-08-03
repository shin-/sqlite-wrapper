var fs = require('fs');
var db = require('..')('/tmp/foo.db', true);

var tableName = 'people';

fs.unlinkSync('/tmp/foo.db');

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
    }, function(err) {
        if (err) throw err;
        createCities();
    });

function createCities() {
    db.createTable('cities', {
        'id': {
            type: 'INTEGER',
            primary: true,
            notnull: true
        },
        'name': {
            type: 'TEXT',
            notnull: true,
            unique: true
        }
    }, function(err) {
        if (err) throw err;
        db.insertAll('cities', [
            { name: 'New York', id: 42 },
            { name: 'Paris', id: 23 },
            { name: 'San Francisco', id: 347 },
            { name: 'Helsinki', id: 378 }
        ], function(err) {
            if (err) throw err;
            crud();
        })
    });
}



// Basic CRUD
function crud() {
    // Single insertion
    db.insert(tableName, {
        name: 'Donald Knuth',
        city_id: 42
    }, function(err) {
        if (err) throw err;
        console.log('Knuth ID:', this.lastID);
        // Update
        db.update(tableName, 'name=?', ['Donald Knuth'], {city_id: 378 }, function(err) {
            if (err) throw err;
            // Select
            db.select(tableName, 
                {'cities': 'cities.id=people.city_id' },
                { 'cities.name': 'city_name', 'people.name': 'person_name' },
                '1',
                null,
                function(err, results) {
                    if (err) throw err;
                    console.log(results);
                },
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
                function(err, result) {
                    if (err) throw err;
                    console.log(result);
                });
        });
    });

    // Multiple inserts (bulk)
    db.insertAll(tableName, [
            { name: 'Dennis Richie', city_id: 23 },
            { name: 'Bjarne Stoustrup', city_id: 347 }
        ], function(err) {
            if (err) throw err;
        });

    // Remove
    db.remove(tableName, 'city_id=?', ['666'], function(err) {
        if (err) throw err;
    });
}