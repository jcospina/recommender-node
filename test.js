/**
 * Created by vivelab on 4/05/17.
 */
var recommender = require('./index');

// recommender.setup("./data/scores.csv", 20, "./data/clusters.json").then(
//     (data) => {
//         console.log(data);
//     }
// );

recommender.recommend(5, 20, "./data/clusters.json").then(
    (items) => {
        console.log("items: " + JSON.stringify(items));
    }
);