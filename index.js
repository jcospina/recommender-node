/**
 * Created by Juan Camilo Ospina on 3/05/17.
 */

var nodeRecommender = {};

var fs = require('fs');
var datamodel = require('./lib/datamodel');
var recommender = require('./lib/recommender');


nodeRecommender.setup = function (path, k, clusterPath) {
    return new Promise(function (resolve, reject) {
        datamodel.loadDataset(path).then(
            (data) => {
                var users = data.users;
                var items = data.items;
                datamodel.getClusters(data.matrix, k).then(
                    (clusters) => {
                        var fileData = {
                            users: users.colArray(),
                            items: items.values,
                            clusters: clusters
                        }
                        fs.writeFile(clusterPath, JSON.stringify(fileData), function (err) {
                            if (!err) {
                                resolve(users.colArray());
                            } else {
                                reject(err);
                            }
                        });
                    }
                ).catch((err) => reject(err));
            }
        ).catch((err) => reject(err));
    });

}

nodeRecommender.recommend = function (userId, n, clusterPath) {
    return new Promise(function (resolve, reject) {
        recommender.recommend(userId, n, clusterPath).then(
            (items) => {
                resolve(items);
            }
        ).catch(err => reject(err));
    });
}

module.exports = nodeRecommender;