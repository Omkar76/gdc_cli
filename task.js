"use strict";

const Cobalt = require("./cobalt");
const validators = require("./validators");
const commandHandlers = require("./commandHandlers");

void (function main() {
  const cobalt = new Cobalt();
  cobalt.missingCommandHandler = function (cmd) {
    console.log("Invalid command :-", cmd);
    commandHandlers.displayHelp();
  };

  cobalt.addCommand("help", [], commandHandlers.displayHelp);
  cobalt.addCommand(undefined, [], commandHandlers.displayHelp);

  cobalt.addCommand(
    "add",
    [
      {
        validator: validators.priorityValidator,
      },
      {
        validator: validators.descriptionValidator,
      },
    ],
    commandHandlers.addTask
  );

  cobalt.addCommand("ls", [], commandHandlers.displayPendingTasks);

  cobalt.addCommand(
    "del",
    [
      {
        validator: validators.deletionIndexValidator,
      },
    ],
    commandHandlers.deleteTask
  );

  cobalt.addCommand(
    "done",
    [
      {
        validator: validators.doneIndexValidator,
      },
    ],
    commandHandlers.markTaskAsDone
  );

  cobalt.addCommand("report", [], commandHandlers.displayReport);

  //execute cmd, args
  cobalt.exec(process.argv[2], process.argv.slice(3));
})();
