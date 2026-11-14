# wdde480
Advanced JavaScript @ UMGC

This repo holds my coursework for WDDE 480 (also listed as CMST 488), and the first thing in it is Project 1, a small Node.js web server in the `project1` folder. I wrote the walkthrough below so another dev could repeat the whole process in order, from reading the starter files all the way to having the project cloned on a local machine, and the code-level detail for the server itself lives in `project1/README.md`.

## Gathering context

Before writing any code I went through the assignment text and the course notes I already had, mainly so I knew what the server was supposed to do and what the grading would look at. Then I cloned the instructor's starter repo from https://github.com/icarnaghan/cmst488-project1 and read through `index.js`, `package.json`, the README, and the `models` and `views` folders. That read-through is worth the few minutes, since the TODO comments in `index.js` basically spell out the order of the work.

## Building the server

Everything is built in `index.js`. I started with the variables, which means port 8000 plus the `http`, `http-status-codes`, `fs`, and `path` modules, and then I wrote the error handler so it returns a 404 with `<h1>Resource not found</h1>`. After that I added the `/healthcheck` route, which returns a 200 with `<h1>OK</h1>`, the static route that serves `/views/index.html` using `fs.readFile` and `path.join`, and the `/api/resources` route that returns the resources as JSON.

Two bugs in the starter code are worth knowing about up front. The error handler is defined to take `(req, res)`, but the starter calls it with only `res`, so I changed the calls to pass both arguments. The file-read error branch also needs a `return` right after the error response, otherwise the server can try to send a second response for the same request.

## Testing it

I ran `npm install` and then `npm run dev` so nodemon was watching the file, and then I requested each route to confirm the results. The health check, the static page, and the API all came back with a 200, with the API returning JSON, and an unknown path came back with a 404. If I recall correctly the quickest way to double check is `curl -i http://localhost:8000/healthcheck`, since it shows the status code along with the body.

## Syncing to GitHub

To keep everything in one place I created a new public repo called `wdde480` with nothing in it, and I kept Project 1 in its own `project1` folder so later projects can sit beside it. One catch is that GitHub added a LICENSE and a README when the repo was created, so I kept both and added a single line about Project 1 to the README instead of overwriting it. Then I committed the project and pushed it to `main`.

## Getting it onto my computer

For the clone I set up an SSH key on my own machine with `ssh-keygen -t ed25519`, since I would rather the private key never leave my computer, and I added the public half to GitHub under Settings, then SSH and GPG keys. After that the clone worked from my `dev` folder:

```
git clone git@github.com:gilbertanderson/wdde480.git
```

I checked that the clone had the latest commit and the `project1` files, and then I ran `npm install` and `npm run dev` myself from inside `project1`. If the SSH clone gives a permission error, the HTTPS address (`https://github.com/gilbertanderson/wdde480.git`) works in the meantime.
