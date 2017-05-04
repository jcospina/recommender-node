/**
 * Created by Juan Camilo Ospina on 3/05/17.
 */

var recommender = {};

const fs = require('fs');

recommender.loadDataset = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, "utf8", function (error, data) {
            if (!error) {
                data = d3.csvParse(data);
                var dataframe = jd.dfFromObjArray(data);
                var interaction_matrix = dataframe.pivot('item', 'rating');
                resolve(interaction_matrix);
            } else {
                reject(error);
            }
        });
    });
}

module.exports = recommender;