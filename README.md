# wdde480-advJS
Advanced JavaScript @ UMGC

This repo holds my WDDE 480 (also listed as CMST 488) coursework, with one folder per project.

| Folder | Project |
| --- | --- |
| [`project1`](project1) | Project 1: a small Node.js web server with a health check, run with nodemon |
| [`project4`](project4) | Project 4: a RESTful API with Express, Mongoose and MongoDB Atlas (also its own repo, [restful-api](https://github.com/gilbertanderson/restful-api)), live at [wdde480-umgc-ganderson58.azurewebsites.net](https://wdde480-umgc-ganderson58.azurewebsites.net/api/resources) |

The rest of this page covers Project 1. What follows is a step-by-step guide so another developer can build the same thing from the starter files and get it onto GitHub and their own computer, and I kept the steps in the order I actually did them, so if you follow them top to bottom you should end up exactly where I did.

## Part 1: Get set up

1. Install Visual Studio Code (https://code.visualstudio.com) and Node.js (https://nodejs.org/en), and since npm comes bundled with Node you will not need a separate install for it. Any text editor works, but VS Code is what the assignment references, so I stuck with it.
2. Confirm both installs by running `node -v` and `npm -v` in a terminal, and each one should print a version number; if either command is not recognized, I would close and reopen the terminal before trying anything else, since the path often does not refresh until you do.
3. Clone the instructor's starter repo and open the folder in your editor, which gives you the `package.json` and the data and view files the project builds on.
   ```
   git clone https://github.com/icarnaghan/cmst488-project1
   cd cmst488-project1
   ```
4. Read through `index.js`, `package.json`, the README, and the `models` and `views` folders before you write anything. It only takes a few minutes, and the TODO comments in `index.js` lay out the work in order, so you will know what to build before you start.
5. Run `npm install`, which pulls in `http-status-codes` and `nodemon` and creates a `node_modules` folder; leave that folder alone, since npm manages it and it should never be edited by hand.

## Part 2: Build the server in index.js

1. Set up the variables at the top of the file, which means the port (8000) and the `http`, `http-status-codes`, `fs`, and `path` modules, since every route below depends on them.
   ```js
   const port = 8000;
   const http = require("http");
   const httpStatus = require("http-status-codes");
   const fs = require("fs");
   const path = require("path");
   ```
2. Finish the error handler so it sends a 404 with an `<h1>Resource not found</h1>` body. The catch here is that with this version of `http-status-codes` the codes live under `httpStatus.StatusCodes`, so writing `httpStatus.NOT_FOUND` the way the starter does will not work.
   ```js
   const sendErrorResponse = (req, res) => {
     res.writeHead(httpStatus.StatusCodes.NOT_FOUND, {
       "Content-Type": "text/html",
     });
     res.end("<h1>Resource not found</h1>");
   };
   ```
3. Add the `/healthcheck` route, which sends a 200 with a short HTML body. The assignment's figure for this page shows a bold heading that reads "Server is running", so that is the text to send, and I believe matching it exactly matters since the rubric scores the health check response and message.
   ```js
   if (req.url === "/healthcheck") {
     res.writeHead(httpStatus.StatusCodes.OK, { "Content-Type": "text/html" });
     res.end("<h1>Server is running</h1>");
   }
   ```
4. Add the static route that serves `/views/index.html` with `fs.readFile` and `path.join`, and put a `return` right after the error response, because without it the server can try to answer the same request twice when a file read fails.
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
5. Add the `/api/resources` route, which sends the resources as JSON, so the content type needs to be `application/json` instead of HTML and the body has to go through `JSON.stringify`.
   ```js
   else if (req.url == "/api/resources") {
     res.writeHead(httpStatus.StatusCodes.OK, {
       "Content-Type": "application/json",
     });
     res.end(JSON.stringify(resources));
   }
   ```
6. Fix the second starter bug, where the error handler is defined as `(req, res)` but gets called as `sendErrorResponse(res)`, which means the response object lands in the wrong parameter. Every call should pass both arguments as `sendErrorResponse(req, res)`, which is how step 4 above and the final `else` branch are already written, so just make sure none of the starter's original calls are left behind.

## Part 3: Test it

1. Start the server with `npm run dev`, which runs nodemon. If you run it before finishing Part 2 you will see `ReferenceError: http is not defined`, and that is expected, since the server code does not exist yet; press Control + C whenever you want to stop nodemon.
2. Open each of these URLs and confirm the result, and to be fair the 404 one is easy to skip, but it is the quickest way to prove the error handler works.
   - `http://localhost:8000/healthcheck` shows the "Server is running" heading with a 200.
   - `http://localhost:8000/views/index.html` shows the static page with a 200.
   - `http://localhost:8000/api/resources` shows the JSON list of five resources with a 200.
   - `http://localhost:8000/nope` shows the "Resource not found" page with a 404.
3. For a quick check that includes the status code and headers, run `curl -i http://localhost:8000/healthcheck`, and this is also handy when you need a clean screenshot for a submission.
4. To see nodemon doing its job, change a line in `index.js` and save the file. The terminal prints a restart message on its own, which is a bit like Gmail quietly saving a draft as you type, since you never have to do anything to trigger it.

## Part 4: Put it on your own GitHub

1. Create a new public repo on GitHub (I named mine `wdde480-advJS`). If you tick the boxes for a LICENSE and README, that is fine, and I kept both instead of overwriting them.
2. Clone your new repo and copy the finished project into a `project1` folder inside it, leaving out `node_modules` and the starter's `.git` folder, since the first can be rebuilt with `npm install` and the second would tangle the two repos together.
3. Commit and push to `main`, and if the push is rejected, run `git pull` first and then push again.
   ```
   git add -A
   git commit -m "Add Project 1: Node.js web server with healthcheck and nodemon"
   git push
   ```

## Part 5: Clone it onto your computer with SSH

1. Generate an SSH key on your own machine so the private key never leaves it, using your GitHub email in place of the placeholder below.
   ```
   ssh-keygen -t ed25519 -C "you@example.com"
   ```
2. Print the public key (`cat ~/.ssh/id_ed25519.pub`, or `type $env:USERPROFILE\.ssh\id_ed25519.pub` in PowerShell) and add it on GitHub under Settings, then SSH and GPG keys, then New SSH key. Only ever share the `.pub` file, because the other one is your private key.
3. Test the connection with `ssh -T git@github.com`, and you should see a greeting with your username if everything is set up correctly.
4. Clone into your dev folder, and if you get a permission error, your key is probably not registered with GitHub yet, so the HTTPS address (`https://github.com/gilbertanderson/wdde480-advJS.git`) works in the meantime.
   ```
   git clone git@github.com:gilbertanderson/wdde480-advJS.git
   ```
5. Confirm the clone has the latest commit and the `project1` files, then run `cd project1`, `npm install`, and `npm run dev` to make sure everything works on your machine too.

The server code notes, including both starter-code bugs, are also in `project1/README.md`.
