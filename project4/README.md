# Project 4: Building a RESTful API

This folder holds my WDDE 480 Project 4, an Express API that reads and writes training resources in MongoDB Atlas, and it is really the payoff of the first three projects. Project 1 served the same five resources from a hardcoded file, Project 2 rendered them through Express with the MVC pattern, and Project 3 moved them into an Atlas database, so this project connects that database to Express and adds full create, read, update and delete over HTTP.

## What I built

The starter from `icarnaghan/cmst488-project4` already had the routes and the database connection wired up in `index.js` and `config/db.js`, so the work lived in two files.

1. `models/Resource.js` defines `name`, `provider` and `url` as required, unique strings, each with its own validation message, which matches the shape of the resources from Projects 1 through 3.
2. `controllers/ResourceController.js` implements `getResources`, `getSingleResource`, `createResource`, `updateResource` and `deleteResource`. Each one returns a 200 with `success: true` and the data, or a 400 with `success: false` and the error message, and update uses `new: true` and `runValidators: true` so an edit cannot sneak past the model's rules.

I also made a few changes beyond the TODOs, since I believe they save trouble later. Unknown ids return a 404 instead of an empty 200, the server listens on `process.env.PORT || 8000` so Azure can assign the port, `web.config` and `iisnode.yml` handle running on Azure (more on that below), and the controller `require` lines now match the file names' capitalization, because the starter's lowercase paths work on Windows and Mac but crash on Linux.

## Running it

1. Copy `config/config.env.txt` to `config/config.env` and set `MONGO_URI` to the Atlas connection string from Project 3. The part after `.mongodb.net/` is the database name, so it needs to point at the database the resources were imported into (mine is `wdde480`), otherwise the API connects to an empty database. `config.env` is in `.gitignore`, so the string never reaches GitHub.
2. Run `npm install`, then `npm run dev`. The assignment text says `nodemon run dev`, but `npm run dev` is the command that actually works.
3. Open `http://localhost:8000/` for the homepage and `http://localhost:8000/api/resources` for the JSON list.

## Testing with Thunder Client

All requests use `http://localhost:8000/api/resources` as the base, and POST and PUT need the header `Content-Type: application/json` (the handout's `application.json` is a typo) with a JSON body containing `name`, `provider` and `url`.

| Request | URL | Expected |
| --- | --- | --- |
| GET all | `/api/resources` | 200 with the list |
| POST | `/api/resources` | 200 with the new record and its `_id` |
| GET one | `/api/resources/<id>` | 200 with that record |
| PUT | `/api/resources/<id>` | 200 with the updated record |
| DELETE | `/api/resources/<id>` | 200 with `data: {}` |

The handout also shows the single-record path as `/api/resource/<id>`, which is missing the "s". To be fair, the error cases are worth a quick try too, since posting a duplicate name or leaving out a field should come back as a 400 with the validation message.

## Deploying to Azure

The UMGC lab's App Service runs Windows with iisnode, and since my lab account has no access to the Azure portal I couldn't set any app settings, so the deployment has to carry everything it needs. That is why the folder has two Azure-only files. `web.config` sends every request to `index.js`, hides `node_modules` and `config` so `config.env` can never be downloaded, and passes the app's own error responses through, while `iisnode.yml` points iisnode at the Node 20 that is already installed on the server, because without `WEBSITE_NODE_DEFAULT_VERSION` it couldn't find `node.exe` at all.

To deploy, I run `npm ci --omit=dev`, then zip `index.js`, `package.json`, `package-lock.json`, `web.config`, `iisnode.yml`, `config` (including my local `config.env`), `controllers`, `models`, `views` and `node_modules` with the files at the top level of the zip. The zip goes up through Kudu's Zip Push Deploy page or its `/api/zipdeploy` endpoint, using the publish profile login from the lab page. Atlas also has to allow the App Service's outbound IP, or `0.0.0.0/0`, under Network Access, and in my case the rule took a few minutes past "Active" before the live `/api/resources` started returning data.
