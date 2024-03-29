# PERN Stack Quiz

A quiz app built with the PERN stack.

## Getting Started

Run the project by following these instructions:

- Install all dependencies in the root and client folders
- Create a new PostgreSQL database and inside it, import the `database.sql` file from the config folder
- Create a `.env` file in the root folder and fill it with the appropriate variables
  - CLOUDINARY_CLOUD_NAME - Your cloud name on Cloudinary
  - CLOUDINARY_FOLDER_NAME - The folder on Cloudinary where you wish images to be saved
  - CLOUDINARY_API_KEY - The API key from your Cloudinary account
  - CLOUDINARY_API_SECRET - The API secret from your Cloudinary account
  - NODE_ENV - Set whether the app should run in `development` mode and have the server act only as an api or in `production` mode and have the server both fetch the client bundle and the api (if not specified, will run in development mode)
  - There are two ways of connecting to a PostgreSQL database:
    - With a URI (when using SSL connection):
      - PG_URI - The PostgreSQL URI to connect to
    - With connection parameters:
      - PG_USER - The database user on whose behalf the connection is being made
      - PG_HOST - The host name of the server
      - PG_DB - The database name
      - PG_PASSWORD - The database user's password
      - PG_PORT - The port number the server is listening on
- Create a `.env.local` file in the client folder and fill it with the appropriate variables
  - REACT_APP_CLOUDINARY_CLOUD_NAME - The cloud name on Cloudinary where the images are hosted, should be the same as CLOUDINARY_CLOUD_NAME from .env
- Run the suitable npm script (requires nodemon to be globally installed to run the server)

```sh
# Run the api server on port 8000 (by default) and the client on port 3000 (by default)
# Build the client bundle before running this command for the first time
npm run dev

# Build the client bundle and run the server on port 8000 (by default)
# The server fetches both the bundle and the api
npm run prod

# Build the client bundle
npm run build

# Run the api server on port 8000 (by default) with live reloading
npm run server

```

- You can reseed the database (resetting any previous information and overwriting it with some example quizzes) by importing the `reseed.sql` file from the config folder
  - Run psql and connect your database, then import with
    - `\i 'C:/some/disk/location/reseed.sql'`
  - Or import directly
    - `psql -U yourdatabaseuser -d yourdatabasename -f "C:/some/disk/location/reseed.sql"`
    - `psql -U yourdatabaseuser yourdatabasename < "C:/some/disk/location/reseed.sql"`

## Author

Borislav Branimirov

## License

This project is licensed under the MIT License
