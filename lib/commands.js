/* Import the exec and spawn functions from the child_process module,
 * which allows us to run terminal commands
 */
const { exec, spawn } = require('child_process');
const prompt = require('prompt-sync')({ sigint: true }); // Allows us to get user input with the prompt() function

// Make a function that stores repository name and other names!!!

// Export this function to be used somewhere else in the codebase
module.exports = function run(cmd) {

    // Checks the value of cmd and runs code based on its value
    switch (cmd) {

        // If cmd == "start"
        case "start":

            // Initialize a git repository
            exec("git init", (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error); // Log error

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr); // Log error

                // If else (successful)
                } else {
                    console.log(stdout); // Log output message
                };
            });

            // Log in to github (gh auth login --web)
            const ghLogin = spawn('gh', ['auth', 'login', '--web'], {
                stdio: 'inherit', // Allows the user to interact with the login prompt
            });
              
            // Listens for an error event
            ghLogin.on('error', (err) => {
                console.error('Failed to start gh auth: ' + err); // Log the error
            });
            break; // End case checking

        // If cmd == "end"
        case "end":

            const logout = prompt("This command logs you out of GitHub. Do you wish to continue? (Y/N) "); // A prompt that stores user input

            // If input as a lowercase is "y"
            if (logout.toLowerCase() === "y") {

            // Log out of GitHub
            exec("gh auth logout --hostname github.com", (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error); // Log error

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr); // Log error

                // If else (successful)
                } else {
                    console.log("Logout successful!"); // Log success message
                };
            });

            // If input as a lowercase is "n"
            } else if (logout.toLowerCase() === "n") {
                console.log("Process terminated."); // Log cancel message

            // If else (invalid input)
            } else {
                console.log("Invalid input. Process terminated."); // Log error message
            };
            break; // End case checking

        // If cmd == "create"
        case "create":
            
            // Create a new GitHub repository
            exec(`gh repo create ${prompt("Name: ")} ${pubOrPriv(prompt("Public or private: "))}`, {
                stdio: "inherit" // Allow the user to interact with the creation prompt
            }, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log("Repository creation failed. " + error); // Log error

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr); // Log error

                // If else (successful)
                } else {
                    console.log(stdout); // Log output (success message)
                };
            });


            // Function to take user input and return a flag based on it
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
            break; // End case checking

        // If cmd == "connect"
        case "connect":
            
            // Connect to a remote repository
            exec(`git remote add ${prompt("Name: ")} ${prompt("Enter url: ")}`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error); // Log error

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr); // Log error

                // If else (successful)
                } else {
                    console.log("Created successfully!"); // Log success message
                };
            });
            break; // End case checking

        // If cmd == "rename"
        case "rename":

            // Rename a remote repository
            exec(`git remote rename ${prompt("Old name: ")} ${prompt("New name: ")}`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {
                    console.log("Name changed successfully!"); // Log success message
                };
            });
            break; // End case checking

        // If cmd == "reurl"
        case "reurl":

            // Rename a remote repository's url
            exec(`git remote add ${prompt("Remote name: ")} ${prompt("New url: ")}`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error); // Log error

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr); // Log error

                // If else (successful)
                } else {
                    console.log("URL changed successfully!"); // Log success message
                };
            });
            break; // End case checking

        // If cmd == "update"
        case "update":
            const upd = prompt("Please make sure you are on the branch you wish to commit to using \`notebook open\` before you proceed. Proceed? (Y/N) ");

            // If input as a lowercase is "y"
            if (upd.toLowerCase() === "y") {

                // Try this block of code
                try {

                    // Add all files to local repository
                    exec(`git add .`, (error, stdout, stderr) => {

                        // If there is an error (error object)
                        if (error) {
                            console.log(error); // Log error

                        // If there is a stderr (error as string)
                        } else if (stderr) {
                            console.log(stderr); // Log error

                        // If else (successful)
                        } else {
                            console.log("Commited successfully!"); // Log success message
                        };
                    });

                    // Commit changes from local repository
                    exec(`git commit -m "${prompt("Commit message: ")}"`, (error, stdout, stderr) => {

                        // If there is an error (error object)
                        if (error) {
                            console.log(error); // Log error

                        // If there is a stderr (error as string)
                        } else if (stderr) {
                            console.log(stderr); // Log error

                        // If else (successful)
                        } else {
                            console.log("Commited successfully!"); // Log success message
                        };
                    });

                    /* // Try this block of code
                    try {
                        // Pull changes from local repository
                        exec(`su root -c git pull ${prompt("Repository name: ")} ${prompt("Branch to commit to: ")}`, (error, stdout, stderr) => {

                            // If there is an error (error object)
                            if (error) {
                                console.log("err" + error); // Log error

                            // If there is a stderr (error as string)
                            } else if (stderr) {
                                console.log(stderr); // Log error

                            // If else (successful)
                            } else {
                                console.log("Pull successful!"); // Log success message
                            };
                        });
                    } catch (e) {
                        console.log(e.message);
                    }; */

                    // Try this block of code
                    try {

                        // Push changes to remote repository
                        exec(`su root -c git push -u ${prompt("Confirm name: ")} ${prompt("Confirm branch: ")}`, (error, stdout, stderr) => {

                            // If there is an error (error object)
                            if (error) {
                                console.log(error); // Log error

                            // If there is a stderr (error as string)
                            } else if (stderr) {
                                console.log(stderr); // Log error

                            // If else (successful)
                            } else {
                                console.log("Push successful!"); // Log success message
                            };
                        });
                    } catch (e) {
                        cosole.log(e.messsage);
                    };

                // Catch any errors
                } catch (e) {
                    console.log(e.message); // Log error
                };
            
            // If input as a lowercase is "n"
            } else if (upd.toLowerCase() === "n") {
                console.log("Process canceled."); // Log cancel message

            // If else
            } else {
                console.log("Invalid input. Process terminated."); // Log error message
            };
            break; // End case checking

        // If cmd == "remove"
        case "remove":
            const rm = prompt("This command deletes the current repository forever. Do you wish to proceed? (Y/N) ");

            // If input as a lowercase is "y"
            if (rm.toLowerCase() === "y") {

                // Delete a repository from github
                exec(`gh repo delete --yes`, {
                    stdio: "inherit" // Allows the user to interact with the deletion prompt
                }, (error, stderr, stdout) => {

                    // If there is an error (error object)
                    if (error) {
                        console.log(error); // Log error

                    // If there is a stderr (error as string)
                    } else if (stderr) {
                        console.log(stderr); // Log error

                    // If else (successful)
                    } else {
                        console.log("Removed repository successfully!"); // Log success message
                    };
                });

                // Remove a remote connection
                exec(`git remote rm ${prompt("Remote name: ")}`, (error, stdout, stderr) => {

                    // If there is an error (error object)
                    if (error) {
                        console.log(error); // Log error

                    // If there is a stderr (error as string)
                    } else if (stderr) {
                        console.log(stderr); // Log error

                    // If else (successful)
                    } else {
                        console.log("Removed remote successfully!"); // Log success message
                    };
                });

            // If input as a lowercase is "n"
            } else if (rm.toLowerCase() === "n") {
                console.log("Process canceled."); // Log cancel message

            // If else (invalid input)
            } else {
                console.log("Invalid input. Process terminated."); // Log error message
            };
            break; // End case checking

        // If cmd == "branch"
        case "branch":

            // Create a new branch
            exec(`git branch ${prompt("Branch name: ")}`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error); // Log error

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr); // Log error

                // If else (successful)
                } else {
                    console.log("Branch creation successful! Run \`notebook open\` to open."); // Log success message
                };
            });
            break; // End case checking

        // If cmd == "open"
        case "open":

            // Open a new branch on git
            exec(`git checkout ${prompt("Branch name: ")}`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error); // Log error

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr); // Log error

                // If else (successful)
                } else {
                    console.log("Entered branch successfully!"); // Log success message
                };
            });
            break; // End case checking

        // If cmd == "view"
        case "view":

            // View all local and remote git branches
            exec(`git branch -a`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {

                    /*
                     * The output for `git branch -a` appears in stderr rather than
                     * stdout because it is considered a "porcelain" command,
                     * which means it's readable for humans and doesn't change
                     * anything, but gives an output.
                     * 
                     * This means that the result is logged as a stderr
                     * because scripted commands ("plumbing" commands)
                     * that actually change something are passed to stdout
                     * so that we can see the result of them to isolate errors/bugs.
                     */

                    // If stderr is NOT empty
                    stderr !== "" ?
                    console.log("Branches: \n" + stderr) : // Log all branches

                    // If else
                    console.log("No branches initialized."); // Log output

                // If else
                } else {
                    console.log(stdout);
                };
            });

            // List all remote repository connections
            exec(`git remote -v`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error);

                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log(stderr);

                // If else (successful)
                } else {

                    // If stdout (list of repositories) is empty
                    stdout !== "" ?
                    console.log("Remote repositories: " + stdout) : // Log the remote repositories

                    // If else
                    console.log("No remote repositores initialized."); // Log output
                };
            });
            break; // End case checking
        case "current":

            // Print the current branch you're in
            exec(`git status`, (error, stdout, stderr) => {

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
            break; // End case checking

        // If cmd == "copy"
        case "copy":

            // Clone a repository
            exec(`git clone ${prompt("URL: ")}`, (error, stdout, stderr) => {

                // If there is an error (error object)
                if (error) {
                    console.log(error); // Log error

                // This command's output is in stderr instead of stdout for the same reason as the view command
                
                // If there is a stderr (error as string)
                } else if (stderr) {
                    console.log("Clone successful!"); // Log error

                // If else (successful)
                } else {
                    console.log(stdout); // Log success message
                };
            });
            break; // End case checking

        // If cmd == any value not defined in the switch statement
        default:
            console.log(`${cmd} is not a valid command. Run \`notebook --help\` or \`notebook -h\` for valid commands.`); // Log error message
    };
};