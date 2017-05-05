# Filtrado colaborativo para Node.js
Sistema de recomendaciones basado en filtrado colaborativo para Node.js.   

El algoritmo implementado se basa en el trabajo de Mehregan Mahdavi y Gilda Moradi Dakhel. El artículo se encuentra disponible en:  
[Research Gate](https://www.researchgate.net/publication/220980957)

## Instalación

```
npm install recommender-node
```

## Primeros pasos

### Importar el módulo:
```
var recommender = require('recommender-node')
```

### Cargar el archivo de ratings
```
recommender.setup("path/to/ratings.csv", 20, "/path/to/clusters.json").then(
    (data) => {
        //Hacer algo una vez se cargan los ratings
    }
);
```

El método setup recibe 3 parámetros:
* La ruta del archivo de ratings: debe ser un archivo csv con formato userId,itemId,rating.
* Número de clusters: el algoritmo implementado usa clustering para obtener los usuarios más similares y así realizar la recomendación. Se recomienda un número entre 10 y 20 clusters.
* La ruta donde se almacenará el archivo de clusters: el algoritmo primero realiza un pre procesamiento para calcular los clusters, esta información se guarda en un archivo con formato JSON.

### Solicitar las recomendaciones

```
recommender.recommend(5, 20, "/path/to/clusters.json").then(
    (items) => {
        console.log("items: " + JSON.stringify(items));
        //Hacer algo con los items recomendados
    }
);
```

El método recommend recibe 3 parámetros:
* El id del usuario al que se le quieren hacer las recomendaciones
* El número de items a recomendar
* La ruta del archivo JSON donde se encuentra la información del clustering

## Limitaciones

En su estado actual el módulo de recomendaciones cuenta con las siguientes limitaciones:

* Solo acepta un archivo de ratings en formato csv y con la estructura: userId, itemId, rating
* La primera fila del archivo de ratings debe tener los siguientes encabezados: user,item,rating
* El sistema solo puede recomendar si el usuario ya ha calificado previamente algún item

Un ejemplo del archivo de ratings se puede encontrar en [data.csv](https://github.com/jcospina/recommender-node/blob/master/dataset/data.csv)

## Dependencias

Este módulo fue construido usando las siguientes librerías:

* [D3](https://www.npmjs.com/package/d3)
* [jsdataframe](https://github.com/osdat/jsdataframe/wiki)
* [linear-algebra](https://www.npmjs.com/package/linear-algebra)
* [node-kmeans](https://www.npmjs.com/package/node-kmeans)


## Autor

MSc. Juan Camilo Ospina Quintero  

## Licencia

Este proyecto se encuentra licenciado bajo GPLv3.0
