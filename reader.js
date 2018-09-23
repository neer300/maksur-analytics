var fs = require('fs');
var Parser = require('csv-parse');

function parseFile(fileName) {
    return new Promise(function(resolve, reject) {
        var result = {};
        var parse = Parser({
            delimiter: ','
        }, function(err, data) {
            if (err) {
                reject(err);
                return;
            }
            var resultArr = [];
            data.forEach(function(line, index) {
                if (index > 0) {
                    resultArr.push({
                        time: line[0],
                        metal_loss: line[2],
                        temperature: line[3]
                    });
                }
            });
            result.data = resultArr;
            result.source = fileName;
            resolve(result);
        });
        fs.createReadStream(fileName).pipe(parse);

    });
}
exports.readFromFile = function() {
    return new Promise(function(resolve, reject) {
        var result = [];
        var promises = [];
        fs.readdir(__dirname + '/sampledata', (err, items) => {
            if (items.length > 0) {
                items.forEach(item => {
                    promises.push(parseFile(__dirname + '/sampledata/' + item));
                })
            }
            return Promise.all(promises).then(function(results) {
                resolve(results);
            })
        })
    })
    
}