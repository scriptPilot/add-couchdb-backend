# Use CouchDB as base image
FROM couchdb:3

# Set environment variables
ENV COUCHDB_USER=root
ENV COUCHDB_PASSWORD=root

# Copy ini file
COPY ./docker/couchdb/couchdb.ini /opt/couchdb/etc/local.d/local.ini