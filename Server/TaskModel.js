const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskTitle: { type: String, require: true },
    taskId: { type: String, require: true },
    status: { type: String, require: true },
    creationDate: { type: String, require: true },
    assignedTo: { type: String, require: true },
    role: { type: String, require: true },
    


});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;