function priorityValidator(priority){
    if(priority === undefined){
        return "Missing task priority."
    }

    priority = +priority;

    if(isNaN(priority) || !Number.isInteger(priority) || priority < 0){
        return "Priority must be non-zero interger!"
    }
}


function descriptionValidator(descriptionWord){
    if(!descriptionWord){
        return "Missing tasks string. Nothing added!"
    }
}
function deletionIndexValidator(index){
    if(!index){
        return "Missing NUMBER for deleting tasks.";
    }
}
function doneIndexValidator(index){
    if(index===undefined){
        return "Missing NUMBER for marking tasks as done.";
    }
}


module.exports = {
    priorityValidator,
    descriptionValidator,
    deletionIndexValidator,
    doneIndexValidator
}