import mongoose from 'mongoose'

const schema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		validate: (data) => {
			return data.length > 0;
		},
		message: 'Title cannot be empty.'
	},
	status: {type: Boolean, default: false}
});

const Task = mongoose.model('Task', schema);

export default Task;
