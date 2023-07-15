// A commandline args handler mini-library.
// Name inspired from golang's Cobra framework XD

class Cobalt {
  constructor() {
    this.cmdHandlersMapping = new Object();
    this.missingCommandHandler = null;
  }

  addCommand(cmd, argRules, handler) {
    this.cmdHandlersMapping[cmd] = {
      argRules,
      handler,
    };
  }

  exec(cmd, args) {
    if (!this.cmdHandlersMapping.hasOwnProperty(cmd)) {
      if (!this.missingCommandHandler) {
        this.defaultMissingCommandHandler(cmd);
      } else {
        this.missingCommandHandler();
      }
      return;
    }

    // Command exists so validate args
    const argRules = this.cmdHandlersMapping[cmd].argRules;

    let argsValid = true;

    for (let i = 0; i < argRules.length; i++) {
      const rule = argRules[i];

      const arg = args[i];

      let error = rule.validator ? rule.validator(arg) : false;

      if (error) {
        argsValid = false;
        console.log(`Error: ${error}`);
      }
    }

    if (argsValid) {
      this.cmdHandlersMapping[cmd].handler(...args);
    }
  }

  defaultMissingCommandHandler(cmd) {
    console.log("No handler for command ", cmd);
  }
}

module.exports = Cobalt;
