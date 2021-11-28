import express from 'express'
import axios from 'axios';
import Task from '../models/task.js'
import {getTasks, getTaskById, createTask, updateTask, removeTask} from '../data/database.js'

const router = express.Router();

axios.defaults.baseURL = 'http://localhost:8080';

router.get('/', async (req, res) => {
	try {
		const tasks = await (await axios.get('/api/tasks')).data;
		res.render('index', {tasks, id: ''});
	} catch(err) {
		res.send(err)
	}
});

router.get('/tasks/:id', async (req, res) => {
	const id = req.params.id;
	const task = await (await axios.get(`/api/tasks/${id}`)).data;
	const status = !task.status;
	await axios.post(`/api/tasks/${id}`, {status: status});
	res.redirect('/');
});

router.get('/tasks/update/:id', async (req, res) => {
	const id = req.params.id;
	const task = await (await axios.get(`/api/tasks/${id}`)).data;
	const tasks = await (await axios.get('/api/tasks')).data;
	if (task)
		res.render('update', {id: task._id, title: task.title, tasks});
	else
		res.status(404).send(`Task not found with id ${id}`);
});

router.get('/tasks/delete/:id', async (req, res) => {
	const id = req.params.id;
	const task = await (await axios.delete(`/api/tasks/${id}`)).data;
	res.redirect('/');
});

router.get('/api/tasks', async (req, res) => {
	const tasks = await getTasks();
	res.send(tasks)
});

router.get('/api/tasks/:id', async (req, res) => {
	const id = req.params.id;
	const task = await getTaskById(id);
	if (task)
		res.send(task);
	else
		res.status(404).send(`Task not found with id ${id}`);
});

router.post('/api/tasks', async (req, res) => {
	if (req.body.title == undefined) {
		res.status(400).send('Title is required');
		return;
	}
	const title = req.body.title;
	const task = await createTask(new Task({title: title}));
	res.redirect('/');
});

router.post('/api/tasks/:id', async (req, res) => {
	if (req.params.id == undefined) {
		res.status(400).send('Id is required');
	}
	const id = req.params.id;
	const task = await getTaskById(id);
	const title = req.body.title;
	task.title = (title != undefined && title != '')? title: task.title;
	task.status = (req.body.status != undefined)? req.body.status : task.status;
	const newTask = await updateTask(task);
	console.log(newTask);
	res.redirect('/');
});

router.delete('/api/tasks/:id', async (req, res) => {
	if (!req.params.id) {
		res.status(400).send('Id is required');
		return;
	}
	const id = req.params.id;
	const task = await removeTask(id);
	if (task)
		res.send(task);
	else
		res.status(404).send(`Task not found with id ${id}`);
});

export default router;
