import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    createdDate: Date;
    updatedDate?: Date;
    tags?: string[];
}

let todos: Todo[] = [];

app.get('/todos', (req: Request, res: Response) => {
    res.json(todos);
});

app.get('/todos/:id', (req: Request, res: Response) => {
    const todo = todos.find(td => td.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('To-do item not found');
    res.json(todo);
});

app.post('/todos', (req: Request, res: Response) => {
    const { title, description, dueDate, priority, tags } = req.body;
    if (!title) return res.status(400).send('Title is required');
    const todo: Todo = {
        id: todos.length + 1,
        title,
        description: description || '',
        completed: false,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        priority: priority || 'medium',
        createdDate: new Date(),
        tags: tags || []
    };
    todos.push(todo);
    res.status(201).json(todo);
});

app.put('/todos/:id', (req: Request, res: Response) => {
    const todo = todos.find(td => td.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('To-do item not found');

    const { title, description, completed, dueDate, priority, tags } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (priority !== undefined) todo.priority = priority;
    if (tags !== undefined) todo.tags = tags;

    res.json(todo);
});

app.delete('/todos/:id', (req: Request, res: Response) => {
    const todoId = todos.findIndex(td => td.id === parseInt(req.params.id));
    if (todoId === -1) return res.status(404).send('To-do item not found');

    const [deletedTodo] = todos.splice(todoId, 1);
    res.json(deletedTodo);
});

app.listen(port, () => {
    console.log(`To-do list REST APT is running on http://localhost:${port}`);
});
