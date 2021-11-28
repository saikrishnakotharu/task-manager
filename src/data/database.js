import mongoose from 'mongoose'
import Task from '../models/task.js'

mongoose.connect('mongodb://localhost/taskManager')
	.then(() => console.log('Connected to mongodb'))
	.catch(err => console.log(err));

export async function getTasks() {
	return await Task.find().select({id: 1, title: 1, status: 1}).sort('status');
}

export async function getTaskById(id) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		console.log('Provide valid id');
		return null;
	}
	const task = await Task.findById(id);
	return task;
}

export async function createTask(task) {
	return await task.save();
}

export async function updateTask(task) {
	const newTask = await Task.findByIdAndUpdate(task.id, {$set: {title: task.title, status: task.status}}, {new: true});
	return newTask;
}

export async function removeTask(id) {
	const task = await Task.findByIdAndRemove(id);
	return task;
}
