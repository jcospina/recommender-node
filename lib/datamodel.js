/**
 * Created by Juan Ospina on 4/05/17.
 */

var fs = require('fs');
var d3 = require('d3');
var jd = require('jsdataframe');
var kmeans = require('node-kmeans');

var datamodel = {};

datamodel.loadDataset = function (path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, "utf8", function (error, data) {
            if (!error) {
                data = d3.csvParse(data);
                var dataframe = jd.dfFromObjArray(data);
                var pivotedMatrix = dataframe.pivot('item', 'rating');
                var interaction_matrix = pivotedMatrix.s(null, jd.rng(1, pivotedMatrix.nCol()));
                var user_matrix = pivotedMatrix.s(null, 0);

                resolve({
                    matrix: interaction_matrix,
                    users: user_matrix,
                    items: interaction_matrix.names()
                });
            } else {
                reject(error);
            }
        });
    });
}

datamodel.loadDatasetFromArray = function (dataArray) {
    return new Promise(function (resolve, reject) {

        if (dataArray == null || dataArray.length == 0) {
            reject("El array de ratings está vacío");
        } else if (!dataArray[0].item || !dataArray[0].user || !dataArray[0].rating) {
            reject("Los datos deben estar en el formato [{user: 'Alice', item: '1', rating: '3'}, ...]");
        } else {
            var dataframe = jd.dfFromObjArray(dataArray);
            var pivotedMatrix = dataframe.pivot('item', 'rating');
            var interaction_matrix = pivotedMatrix.s(null, jd.rng(1, pivotedMatrix.nCol()));
            var user_matrix = pivotedMatrix.s(null, 0);

            resolve({
                matrix: interaction_matrix,
                users: user_matrix,
                items: interaction_matrix.names()
            });
        }
    });
}

datamodel.getClusters = function (matrix, k) {
    var tMatrix = matrix.toMatrix();

    return new Promise(function (resolve, reject) {
        kmeans.clusterize(tMatrix, {k: k}, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}

module.exports = datamodel;