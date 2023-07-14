"use strict"
const path = require('path');
const fs = require('fs');

const Cobalt = require('./cobalt');

const completedTasksFile = path.resolve(process.cwd(), "completed.txt");
const pendingTasksFile = path.resolve(process.cwd(), "task.txt");

class Task{
    constructor(index, note, priority){
        this.index = index;
        this.note = note;
        this.priority = priority;
    }
}

function displayHelp(){
    console.log(
        `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`
        );
}
function addTask(priority, ...descriptionWords){
    const description = descriptionWords.join(" ");
    fs.appendFileSync(pendingTasksFile, `${priority} ${description}\n`);
    console.log(`Added task: "${description}" with priority ${priority}`);    
}

function getPendingTasks(){
    let fileText = "";
    try{
        fileText = fs.readFileSync(pendingTasksFile).toString().trim();
    }catch(e){
        return [];
    }

    if(!fileText){
        return [];
    }

    const lines = fileText.split("\n");

    const pendingTasks = lines.map(line=>{
        const priority = + line.substring(0, line.indexOf(" "));
        const description = line.substring(line.indexOf(" ") + 1);

        return {priority, description};
    })

    pendingTasks.sort((a, b)=>{
        return a.priority - b.priority;
    });

    return pendingTasks;
}

function displayPendingTasks(index){
    const pendingTasks = getPendingTasks();

    if(pendingTasks.length == 0){
        console.log("There are no pending tasks!\n");
        return;
    }

    pendingTasks.forEach((task, index) => {
        console.log(`${index + 1}.`, task.description, `[${task.priority}]`);
    });
}

function deleteTodo(indexToDelete){
    const pendingTasks = getPendingTasks();
    if(pendingTasks.length == 0){
        console.log("There are no pending tasks!\n");
        return;
    }

    let newFileContent = "";
    let lineDeleted = false;
    pendingTasks.forEach((task, index) => {
        // for user, indexing starts at 1

        if(index  + 1 != +indexToDelete){
            newFileContent += `${task.priority} ${task.description}\n`;
        }else{
            lineDeleted = true;
        }
    });

    if(lineDeleted){
        fs.writeFileSync(pendingTasksFile, newFileContent);
        console.log(`Deleted task #${indexToDelete}`); 
    }else{
        console.log(`Error: task with index #${indexToDelete} does not exist. Nothing deleted.`);
    }
}

void function main(){ 
    const cobalt = new Cobalt();    

    cobalt.addCommand("add", [
        {
        validator : (priority)=>{
            // Commenting for the sake of test cases

            priority = +priority;

            if(isNaN(priority) || !Number.isInteger(+priority) || priority < 0){
                return "Error: Priority must be non-zero interger!"
            }
        }
        },
        {
            validator : (descriptionWord)=>{
                if(!descriptionWord){
                    return "Missing tasks string. Nothing added!"
                }
            }
        }
    ],  
    addTask
    );

    cobalt.addCommand("help", [], displayHelp);
    cobalt.addCommand(undefined, [], displayHelp);
    cobalt.addCommand("ls", [], displayPendingTasks);
    cobalt.addCommand("del", [], deleteTodo);
    // cobalt.addCommand("done", [], done);
    // cobalt.addCommand("report", [],  done);
    cobalt.exec(process.argv[2], process.argv.slice(3));
}();


