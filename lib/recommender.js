/**
 * Created by Juan Camilo Ospina on 4/05/17.
 */

var recommender = {};

var jd = require('jsdataframe');
var fs = require('fs');
var linearAlgebra = require('linear-algebra')(),     // initialise it
    Vector = linearAlgebra.Vector,
    Matrix = linearAlgebra.Matrix;

recommender.recommend = function (userId, n, clusterPath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(clusterPath, "utf8", function (error, data) {
            if (!error) {
                var clusters = JSON.parse(data);
                var userCluster = findUserCluster(userId, clusters);
                var items = getItemsRating(userCluster, clusters.items);
                var sortedItems = items.sort(compare);
                var recommendation = (sortedItems.length > n) ? sortedItems.slice(0, n - 1) : sortedItems;
                resolve(recommendation);
            } else {
                reject(error)
            }
        });
    });
};

var compare = function (a, b) {
    if (a.score > b.score)
        return -1;
    if (a.score < b.score)
        return 1;
    return 0;
}

var findUserCluster = function (userId, clusters) {
    var userIdx = clusters.users[0].values.indexOf(userId + '');
    for (var cluster of clusters.clusters) {
        var indexInCluster = cluster.clusterInd.indexOf(userIdx);
        if (indexInCluster >= 0) {
            return cluster.cluster;
        }
    }
}

var getItemsRating = function (usersInCluster, items) {
    var dataframe = jd.dfFromObjArray(usersInCluster);
    var currentUserRatings = dataframe.s(0, null).toMatrix();
    var neighborsRatings = dataframe.s(jd.rng(1, dataframe.nRow()), null).toMatrix();
    var clusterRatingMatrix = new Matrix(neighborsRatings);
    var normalizedMatrix = normalizeMatrix(clusterRatingMatrix, 4);
    var scores = sumColumns(normalizedMatrix);
    return getRecommendedItems(items, scores.toArray()[0], currentUserRatings[0]);

}

var normalizeMatrix = function (matrix, r) {
    var normalizedMatrix = matrix.map(function (v) {
        return (v >= r) ? 1 : 0;
    });
    return normalizedMatrix;
}

var sumColumns = function (matrix) {
    var sumVector = Vector.zero(matrix.rows).plusEach(1);
    return sumVector.dot(matrix);
}

var getRecommendedItems = function (items, scores, currentUserRatings) {
    var recommendedItems = [];
    for (var i = 0; i < items.length; i++) {
        var item = currentUserRatings[i];
        if (item <= 0 || item == null) {
            recommendedItems.push({
                itemId: items[i],
                score: scores[i]
            });
        }
    }
    return recommendedItems;
}

module.exports = recommender;