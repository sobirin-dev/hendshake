'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export default function TodoList() {
    // State management for tasks and form inputs
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('education');
    const [bookingRequired, setBookingRequired] = useState(false);
    const [accessibility, setAccessibility] = useState(0.5);

    // Load tasks from localStorage on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    // Persist tasks to localStorage when tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Function to add a new task, wrapped in useCallback to prevent unnecessary re-renders
    const addTask = useCallback(() => {
        if (input.trim() === '' || price.trim() === '') return;
        setTasks((prevTasks) => [
            ...prevTasks,
            { id: Date.now(), text: input, price, type, bookingRequired, accessibility },
        ]);
        setInput('');
        setPrice('');
        setType('education');
        setBookingRequired(false);
        setAccessibility(0.5);
    }, [input, price, type, bookingRequired, accessibility]);

    // Function to remove a task by ID
    const removeTask = useCallback((id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }, []);

    // Memoize task count for performance optimization
    const taskCount = useMemo(() => tasks.length, [tasks]);

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
            <h2 className="text-lg font-semibold mb-2">Total Items: {taskCount}</h2>
            <div className="flex flex-col gap-4 mb-4">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Activity" />
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />

                <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="recreational">Recreational</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="diy">DIY</SelectItem>
                        <SelectItem value="charity">Charity</SelectItem>
                        <SelectItem value="cooking">Cooking</SelectItem>
                        <SelectItem value="relaxation">Relaxation</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="busywork">Busywork</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    <Checkbox checked={bookingRequired} onCheckedChange={setBookingRequired} />
                    <span>Booking Required</span>
                </div>

                <div>
                    <label className="block text-sm font-medium">Accessibility</label>
                    <Slider min={0} max={1} step={0.1} value={[accessibility]} onValueChange={(val) => setAccessibility(val[0])} />
                </div>

                <Button onClick={addTask}>Add</Button>
            </div>
            <div>
                {tasks.map((task) => (
                    <Card key={task.id} className="mb-2 p-2">
                        <CardContent>
                            <p><strong>Activity:</strong> {task.text}</p>
                            <p><strong>Price:</strong> ${task.price}</p>
                            <p><strong>Type:</strong> {task.type}</p>
                            <p><strong>Booking Required:</strong> {task.bookingRequired ? 'Yes' : 'No'}</p>
                            <p><strong>Accessibility:</strong> {task.accessibility}</p>
                        </CardContent>
                        <Button variant="ghost" onClick={() => removeTask(task.id)}>
                            <Trash2 size={16} />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
