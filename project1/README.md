# Project 1: Setting Up a Node.js Web Server

This is my write-up for WDDE 480 (also listed as CMST 488) Project 1, and I wrote it so that another dev could redo the whole thing from scratch without having to guess at anything. The goal of the project is a small Node.js web server that serves a health check page, returns JSON from a simple API, and serves a static HTML page, all of it running under nodemon so the server restarts on its own whenever a file changes.

## What you need first

You will need Node.js (which comes with npm) and a text editor, and I used Visual Studio Code since that is what the assignment recommends. If I recall correctly I was on Node 22 when I tested this, but any current LTS version should be fine. You can confirm both installs worked by running `node -v` and `npm -v` in a terminal, and each should print a version number.

## Getting the starter files

The instructor provides a starter repo at https://github.com/icarnaghan/cmst488-project1, and it already includes the `package.json`, a `models/resources.js` file with the API data, and a `views/index.html` page. You can clone it or download the zip, and then open that folder in VS Code. If you are starting from my copy instead, clone this repo and move into the project folder:

```
git clone git@github.com:gilbertanderson/wdde480.git
cd wdde480/project1
```

If the SSH clone fails with a permission error, your SSH key probably is not set up with GitHub yet, and the HTTPS address (`https://github.com/gilbertanderson/wdde480.git`) will work in the meantime.

## Installing and running

Run `npm install` to pull in `http-status-codes` and `nodemon`, which creates a `node_modules` folder that you should leave alone. Then start the server with `npm run dev`, which runs `nodemon index`. The first time you run this against the untouched starter files you will get `ReferenceError: http is not defined`, and that is expected, since the server code has not been written yet. To stop nodemon, press Control + C.

## Completing index.js

Everything happens in `index.js`, where the starter file leaves a handful of TODO comments for you to fill in. I did them in this order, and I will point out the two places where the starter code tripped me up.

First I set up the variables, which means a `port` constant set to 8000 plus `require` calls for `http`, `http-status-codes`, `fs`, and `path`. One thing worth knowing is that with the `http-status-codes` version in this project the codes live under `httpStatus.StatusCodes`, so a 404 is `httpStatus.StatusCodes.NOT_FOUND` rather than `httpStatus.NOT_FOUND`.

Next came the error handler, which sends the 404 header and then ends the response with `<h1>Resource not found</h1>`. This is where the first catch is. The function is defined to take `(req, res)`, but the starter code calls it with only `res`, so the response object ends up in the wrong spot, and I changed every call to pass both arguments.

For the web server itself, the `/healthcheck` route returns a 200 with a short HTML body. The assignment shows the expected page in a figure, and it is a bold heading that reads "Server is running", so I used `<h1>Server is running</h1>` to match it exactly. The static route reads `views/index.html` with `fs.readFile` and `path.join(__dirname, "views", "index.html")`, then sends a 200 with a `text/html` content type. The second catch lives here, because the starter does not stop after a read error, which means it can try to send a response twice, so I added a `return` right after the error response. Finally, the API route sends a 200 with `application/json` and returns `JSON.stringify(resources)`.

## Testing it

With `npm run dev` running, I checked four URLs in the browser. Going to `http://localhost:8000/healthcheck` should show the "Server is running" heading, `http://localhost:8000/views/index.html` should show the static page, and `http://localhost:8000/api/resources` should show the JSON list of five resources. Anything else, such as `http://localhost:8000/nope`, should give the "Resource not found" 404 page. If you would rather test from the command line, `curl -i http://localhost:8000/healthcheck` shows the status code and headers too, which is handy for a screenshot. To see nodemon doing its job, change a line in `index.js` and save, and the terminal will print a restart message without you touching anything.

## A few notes

The assignment mentions an `about.html` page, but the starter repo only has `index.html`, so I did not build a route for it. The starter README also says the server runs on port 5000, while the assignment and the code use 8000, and in my opinion that is just a leftover from an older version. Last, `node_modules` is in `.gitignore`, so anyone who clones this has to run `npm install` before the server will start.

## Pushing your work to GitHub

Once everything runs, the sync is the usual routine, which is `git add -A`, then `git commit -m "your message"`, then `git push`. That said, if the push is rejected, run `git pull` first and then push again.
