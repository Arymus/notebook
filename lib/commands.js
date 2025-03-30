/* Import the exec and spawn functions from the child_process module,
 * which allows us to run terminal commands
 */
const { exec, spawn } = require('child_process');
const prompt = require('prompt-sync')({ sigint: true }); // Allows us to get user input with the prompt() function
const sudo = require('sudo'); // Allows us to run commands as the root, or sudo

module.exports = function run(cmd) {

    // Checks the value of cmd and runs code based on its value
    switch (cmd) {

        // If cmd == "start"
        case "start":

            // Initialize a git repository
            exec("git init", (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error + error.code);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log(stdout);
                };
            });

            // Log in to github
            const ghLogin = spawn('gh', ['auth', 'login', '--web'], {
                stdio: 'inherit', // Allows the user to interact with the login prompt
            });
              
            // Listens for an error event
            ghLogin.on('error', (err) => {
                console.error('Failed to start gh auth: ', err);
            });
            break;

        // If cmd == "end"
        case "end":

            const logout = prompt("This command logs you out of GitHub. Do you wish to continue? (Y/N) ");

            if (logout.toLowerCase() === "y") {
            // Log out of git
            exec("gh auth logout --hostname github.com", (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("Logout successful!");
                };
            });
            break;
        } else if (logout.toLowerCase() === "n") {
            console.log("Process terminated.");
            break;
        } else {
            console.log("Invalid input. Process terminated.");
            break;
        };

        // If cmd == "create"
        case "create":
            
            exec(`gh repo create ${prompt("Name: ")} ${pubOrPriv(prompt("Public or private: "))}`, {
                stdio: "inherit" // Allow the user to interact with the creation prompt
            }, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log("Repository creation failed. " + error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log(stdout);
                };
            });

            function pubOrPriv(prompt) {

                // If pubOrPriv as a lowercase is "public"
                if (prompt.toLowerCase() === "public") {
                    return "--public"; // Return public flag

                // If pubOrPriv as a lowercase is "private"
                } else if (prompt.toLowerCase() === "private") {
                    return "--private"; // Return private flag
                
                // If else
                } else {
                    return "^C"; // Cancel operation
                };
            };
            break;

        // If cmd == "connect"
        case "connect":
            
            // Connect to a remote repository
            exec(`git remote add ${prompt("Name: ")} ${prompt("Enter url: ")}`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("Created successfully!");
                };
            });
            break;

        // If cmd == "rename"
        case "rename":

            // Rename a remote repository
            exec(`git remote rename ${prompt("Old name: ")} ${prompt("New name: ")}`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("Name changed successfully!");
                };
            });
            break;

        // If cmd == "reurl"
        case "reurl":

            // Rename a remote repository's url
            exec(`git remote add ${prompt("Remote name: ")} ${prompt("New url: ")}`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("URL changed successfully!");
                };
            });
            break;

        // If cmd == "update"
        case "update":
            const upd = prompt("Please make sure you are on the branch you wish to commit to (notebook open <branch>) before you proceed. Proceed? (Y/N) ");

            // If input as a lowercase is "y"
            if (upd.toLowerCase() === "y") {

                // Try this block of code
                try {
                    exec(`git add .`, (error, stderr, stdout) => {

                        // If there is an error (error object)
                        if (error) {
                            console.log(error);

                        // If there is a stderr (error as string)
                        } else if (stderr) {
                            console.log(stderr);

                        // If else (successful)
                        } else {
                            console.log("Commited successfully!");
                        };
                    });

                    exec(`git commit -m "${prompt("Commit message: ")}"`, (error, stderr, stdout) => {

                        // If there is an error (error object)
                        if (error) {
                            console.log(error);

                        // If there is a stderr (error as string)
                        } else if (stderr) {
                            console.log(stderr);

                        // If else (successful)
                        } else {
                            console.log("Commited successfully!");
                        };
                    });

                    exec(sudo(`sudo git pull ${prompt("Repository name: ")} ${prompt("Branch to commit to: ")}`, (error, stderr, stdout) => {

                        // If there is an error (error object)
                        if (error) {
                            console.log(error);

                        // If there is a stderr (error as string)
                        } else if (stderr) {
                            console.log(stderr);

                        // If else (successful)
                        } else {
                            console.log(stdout);
                        };
                    }));

                    exec(sudo(`sudo git push -u ${prompt("Confirm name: ")} ${prompt("Confirm branch: ")}`, (error, stderr, stdout) => {

                        // If there is an error (error object)
                        if (error) {
                            console.log("bye" + error);

                        // If there is a stderr (error as string)
                        } else if (stderr) {
                            console.log("hi" + stderr);

                        // If else (successful)
                        } else {
                            console.log("Push successful!");
                        };
                    }));
                } catch (e) {
                    console.log(e.message);
                };
            
            // If input as a lowercase is "n"
            } else if (upd.toLowerCase() === "n") {
                console.log("Process canceled."); // Log cancel message
                return;

            // If else
            } else {
                console.log("Invalid input. Process terminated."); // Log error message
            };
            break;

        // If cmd == "remove"
        case "remove":
            const rm = prompt("This command deletes the current repository forever. Do you wish to proceed? (Y/N) ");

            // If input as a lowercase is "y"
            if (rm.toLowerCase() === "y") {
                exec(`gh repo delete --yes`, {
                    stdio: "inherit" // Allows the user to interact with the deletion prompt
                }, (error, stderr, stdout) => {

                    // If there is an error (error object)
                    if (error) {
                        console.log(error + error.code);

                    // If there is a stderr (error as string)
                    } else if (stderr) {
                        console.log(stderr);

                    // If else (successful)
                    } else {
                        console.log("Removed repository successfully!");
                    };
                });

                exec(`git remote rm ${prompt("Remote name: ")}`, (error, stderr, stdout) => {

                    // If there is an error (error object)
                    if (error) {
                        console.log(error + error.code);

                    // If there is a stderr (error as string)
                    } else if (stderr) {
                        console.log(stderr);

                    // If else (successful)
                    } else {
                        console.log("Removed remote successfully!");
                    };
                });

            // If input as a lowercase is "n"
            } else if (rm.toLowerCase() === "n") {
                console.log("Process canceled."); // Log cancel message
                return;
            } else {
                console.log("Invalid input. Process terminated."); // Log error message
            };
            break;

        // If cmd == "branch"
        case "branch":
            exec(`git branch ${prompt("Branch name: ")}`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("Branch creation successful! Run notebook open <branch-name> to open.");
                };
            });
            break;

        // If cmd == "open"
        case "open":
            exec(`git checkout ${prompt("Branch name: ")}`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("Entered branch successfully!");
                };
            });
            break;

        // If cmd  == "view"
        case "view":
            exec(`git branch -a`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    stderr !== "" ?
                    console.log("Branches: \n" + stderr) :
                    console.log("No branches initialized.");

                // If else (successful)
                } else {
                    stdout !== "" ?
                    console.log("Branches: \n" + stdout) :
                    console.log("No branches initialized.");
                };
            });

            exec(`git remote -v`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    stdout !== "" ?
                    console.log("Remote repositories: " + stdout) :
                    console.log("No remote repositores initialized.");
                };
            });
            break;
        case "current":
            exec(`git status`, (error, stderr, stdout) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("Commited successfully!");
                };
            });
            break;

        // (Techically) if else
        default:
            console.log(`${cmd} is not a valid command. Run --help or -h for valid commands.`); // Log error message
    };
};