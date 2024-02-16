# Add CouchDB Backend

Add [CouchDB](https://couchdb.apache.org/) and [PouchDB](https://pouchdb.com/) to your local development environment.

## Installation

1. Install [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/)

2. Create a new app project:

    ```bash
    npm create vite
    ```

3. Add CouchDB as a backend:

    ```bash
    npx add-couchdb-backend
    ```

4. Add PouchDB to the frontend:

   ```bash
   npm install pouchdb
   ```

## Usage

- Run `npm run backend` to start the backend
- Open the CouchDB backend at http://localhost:5984/_utils/
  - Login with username `root` and password `root`
- Synchronize the database with the frontend:

    ```js 
    // Import PouchDB
    import '../node_modules/pouchdb/dist/pouchdb.min.js'

    // Configure the local and remote databases
    const db = new PouchDB('development')
    const dbRemote = new PouchDB('http://localhost:5984/development')

    // Synchronize both databases
    db.sync(dbRemote, { live: true, retry: true })
    ```


## How it works

- **no dependency** will be added to the repository (only PouchDB itself)
- you have **full control** of all source files for fine tuning
- running `npx add-couchdb-backend` will download the package in a cache folder
  - the package will create a `docker/` folder with the Dockerfile
  - the package will create a `docker-composer.yml` file to configure the container setup
  - the package will add a `backend` script to the `package.json` file

## Support

Report bugs in the [issues list](https://github.com/scriptPilot/add-couchdb-backend/issues).

## Maintainer

1. Commit changes with an issue (closure) reference
2. Run `npm version patch | minor | major` and push changes
3. Let the workflow manage the release to GitHub and NPM
