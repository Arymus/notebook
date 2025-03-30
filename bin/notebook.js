#!/usr/bin/env node
// ^ Allows us to run this file without the node command by referencing the interpreter

const arg = require("arg"); // Import the arg package for parsing arguments

// Try to run a block of code
try {
    // Define the arguments that can be used when we run notebook
    const args = arg({
	"--help": Boolean, // Add a help flag
    "--version": Boolean, // Add a version flag

    "-v": "--version", // Alias for --version
    "-h": "--help", // Alias for --help
    });

    // If the argument is --help
    if (args["--help"]) {

        // Log all the commands and flags
        console.log(`Usage:

notebook start                          Log in to github
notebook end                            Log out of github
notebook create                         Create a repository (remote and on github)
notebook connect                        Connect to a remote repository
notebook rename                         Change an existing connection's name
notebook reurl                          Change an existing connection's url
notebook update                         Makes a commit and pushes it to the remote repo
notebook remove                         Remove a remote repository
notebook branch                         Create a new branch
notebook open                           Switch to a different branch  
notebook current                        Shows the branch you're in
notebook view                           View all branches and remote repositories

Flags:

--help (or -h)                          Show this help message
--version (or -v)                       Show the version of notebook
        `);

    // If the argument is --version
    } else if (args["--version"]) {
        const { version } = require("../package.json"); // Import the version from package.json
        console.log(`notebook v${version}`); // Log the version
    } else if (args["--dry"]) {

    };

    const run = require("../lib/commands"); // Import the run function from commands.js

    // If there are no flags, check for the command
    if (!process.argv[2].includes("--help") && !process.argv[2].includes("--version")) {
        run(process.argv[2]);
    };

// Catch any errors
} catch (e) {
    console.log(e.message); // Log the error
};
