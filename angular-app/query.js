const _ = require('underscore');
const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({
  hosts: ['http://localhost:9200']
})


let searchResults = elasticClient.search({
  index: 'twitter',
  q: 'message:the',
  size: 100
})


searchResults.then(values => {
  _.each(values.hits.hits, value => {
    console.log(value._source.message)
  })
})