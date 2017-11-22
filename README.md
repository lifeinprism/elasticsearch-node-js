# elasticsearch-node-js

# What it does

Grabs data from a Twitter user, and pushes it into an Elasticsearch index called "Twitter". If a document with a matching ID is found, it will first delete the document before readding it. This is because Elasticsearch does not natively allow data to be transformed once it is created.

# Use

From the command-line type: node runner arg

Where arg is the name of the Twitter account that you're trying to pull from.

For example: node runner barackobama

This will pull all tweets from former President Barack Obama from the last 7 days (default).