# wdde480
Advanced JavaScript @ UMGC

This repo holds my WDDE 480 (also listed as CMST 488) coursework, and right now it contains Project 1, a small Node.js web server in the `project1` folder. What follows is a step-by-step guide so another developer can build the same thing from the starter files and get it onto GitHub and their own computer, and I kept the steps in the order I actually did them.

## Part 1: Get set up

1. Install Visual Studio Code (https://code.visualstudio.com) and Node.js (https://nodejs.org/en), since Node comes with npm. Any text editor works, but VS Code is what the assignment uses.
2. Confirm both installs by running `node -v` and `npm -v` in a terminal. Each one should print a version number.
3. Clone the instructor's starter repo, then open the folder in your editor:
   ```
   git clone https://github.com/icarnaghan/cmst488-project1
   cd cmst488-project1
   ```
4. Read through `index.js`, `package.json`, the README, and the `models` and `views` folders. The TODO comments in `index.js` list the work in order, so this is worth a few minutes.
5. Run `npm install`. This pulls in `http-status-codes` and `nodemon` and creates a `node_modules` folder, which you should leave alone.

## Part 2: Build the server in index.js

1. Set up the variables at the top of the file: the port (8000) and the `http`, `http-status-codes`, `fs`, and `path` modules.
   ```js
   const port = 8000;
   const http = require("http");
   const httpStatus = require("http-status-codes");
   const fs = require("fs");
   const path = require("path");
   ```
2. Finish the error handler so it returns a 404 with an `<h1>Resource not found</h1>` body. With this version of `http-status-codes` the codes live under `httpStatus.StatusCodes`.
   ```js
   const sendErrorResponse = (req, res) => {
     res.writeHead(httpStatus.StatusCodes.NOT_FOUND, {
       "Content-Type": "text/html",
     });
     res.end("<h1>Resource not found</h1>");
   };
   ```
3. Add the `/healthcheck` route, which returns a 200 with a short HTML body. The assignment figure for this page was not visible to me, so I used `<h1>OK</h1>`, and you should match your own figure if it shows something different.
   ```js
   if (req.url === "/healthcheck") {
     res.writeHead(httpStatus.StatusCodes.OK, { "Content-Type": "text/html" });
     res.end("<h1>OK</h1>");
   }
   ```
4. Add the static route that serves `/views/index.html` with `fs.readFile` and `path.join`, and put a `return` after the error response so the server never tries to answer the same request twice.
   ```js
   else if (req.url === "/views/index.html") {
     fs.readFile(path.join(__dirname, "views", "index.html"), (error, data) => {
       if (error) {
         sendErrorResponse(req, res);
         return;
       }
       res.writeHead(httpStatus.StatusCodes.OK, { "Content-Type": "text/html" });
       res.end(data);
     });
   }
   ```
5. Add the `/api/resources` route, which sends the resources as JSON.
   ```js
   else if (req.url == "/api/resources") {
     res.writeHead(httpStatus.StatusCodes.OK, {
       "Content-Type": "application/json",
     });
     res.end(JSON.stringify(resources));
   }
   ```
6. Fix the starter bug where the error handler is defined as `(req, res)` but called as `sendErrorResponse(res)`. Every call should pass both arguments, as in `sendErrorResponse(req, res)`, which is already how steps 4 above and the final `else` branch are written.

## Part 3: Test it

1. Start the server with `npm run dev`, which runs nodemon. The first run against the untouched starter files shows `ReferenceError: http is not defined`, and that is expected until Part 2 is done. Press Control + C to stop nodemon.
2. Open each URL and confirm the result:
   - `http://localhost:8000/healthcheck` shows the OK page with a 200.
   - `http://localhost:8000/views/index.html` shows the static page with a 200.
   - `http://localhost:8000/api/resources` shows the JSON list of five resources with a 200.
   - `http://localhost:8000/nope` shows the "Resource not found" page with a 404.
3. For a quick check with status codes and headers, run `curl -i http://localhost:8000/healthcheck`. This is also handy for screenshots.
4. To see nodemon working, change a line in `index.js` and save. The terminal prints a restart message on its own.

## Part 4: Put it on your own GitHub

1. On GitHub, create a new public repo (I named mine `wdde480`). GitHub will add a LICENSE and README if you tick those boxes, and it is fine to keep both.
2. Clone your new repo and copy the finished project into a `project1` folder inside it, leaving out `node_modules` and the starter's `.git` folder.
3. Commit and push to `main`:
   ```
   git add -A
   git commit -m "Add Project 1: Node.js web server with healthcheck and nodemon"
   git push
   ```

## Part 5: Clone it onto your computer with SSH

1. Generate an SSH key on your own machine, so the private key never leaves it. Use your GitHub email:
   ```
   ssh-keygen -t ed25519 -C "you@example.com"
   ```
2. Print the public key (`cat ~/.ssh/id_ed25519.pub`, or `type $env:USERPROFILE\.ssh\id_ed25519.pub` in PowerShell) and add it on GitHub under Settings, then SSH and GPG keys, then New SSH key. Only ever share the `.pub` file.
3. Test the connection with `ssh -T git@github.com`. You should see a greeting with your username.
4. Clone into your dev folder:
   ```
   git clone git@github.com:gilbertanderson/wdde480.git
   ```
   If this gives a permission error, your key is probably not set up yet, and the HTTPS address (`https://github.com/gilbertanderson/wdde480.git`) works in the meantime.
5. Confirm the clone has the latest commit and the `project1` files, then run `cd project1`, `npm install`, and `npm run dev` to make sure everything works on your machine.

The server code notes, including the two starter-code bugs, are also in `project1/README.md`.
