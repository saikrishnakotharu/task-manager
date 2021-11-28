import express from 'express'
import router from './controller/taskController.js'

const app = express();
const PORT = 8080;
const HOST = 'localhost';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/', router);

app.listen(PORT, HOST, () => console.log(`Server is running on http://${HOST}:${PORT}`));
