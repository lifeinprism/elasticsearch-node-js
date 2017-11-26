angular.module('App', ['elasticsearch'])

.service('client', function (esFactory) {
  return esFactory({
    host: 'localhost:9200',
    log: 'trace'
  });
})

.controller('MainCtrl', function($scope, client, esFactory) {

  client.search({
    index: 'twitter',
    q: `name:god`,
    size: 10
  })
  .then(resp => {
    $scope.results = resp.hits.hits;
    $scope.error = null;
  })
  .catch(err => {
    $scope.results = null;
    $scope.error = err;

    if (err instanceof esFactory.errors.NoConnections) {
      $scope.error = new Error('Unable to connect to elasticsearch. ' +
        'Make sure that it is running and listening at http://localhost:9200');
    }
  });
});