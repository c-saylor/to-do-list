import React, { useEffect, useState } from 'react';
import { Todo } from './types/todo';
import TodoItem from './components/ToDoItem';
import './styles/App.scss';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { loadTodos, saveTodos } from './utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos());
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'custom'>('custom');

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);


  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTodos([...todos, {
      id: String(Date.now()), // string ID
      text: input.trim(),
      completed: false,
      createdAt: new Date(),
    }]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex(todo => todo.id === active.id);
    const newIndex = todos.findIndex(todo => todo.id === over.id);



    setTodos(prev => arrayMove(prev, oldIndex, newIndex));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;;
    if (filter === 'completed') return todo.completed;
    return true;
  }).sort((a, b) => {
    if (sort === 'newest') return b.createdAt.getTime() - a.createdAt.getTime();
    if (sort === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime();
    if (sort === 'az') return a.text.localeCompare(b.text);
    return 0;
  })

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a task"
        />
        <button type="submit">Add</button>
      </form>


      {todos.length > 0 && (
        <div className="controls">
          <div className="filters">
            <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
            <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
            <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A–Z</option>
            <option value="custom">Custom</option>
          </select>
        </div>)}

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add a new task to get started!</p>
        </div>
      ) :
        filteredTodos.length === 0 ? (filter === 'active' ? <p>All current tasks complete! 🎉 </p> : <p>No completed tasks (yet).</p>) :
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos.map(todo => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="todo-list">
                <AnimatePresence>

                  {filteredTodos.map((todo) => (
                    <motion.div
                      layout
                      key={todo.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        isDragEnabled={sort === 'custom'}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ul>
              <button className="clear-btn" onClick={() => {
                const confirmed = window.confirm('Are you sure you want to clear your todo list? This will remove both active and completed tasks.');
                if (confirmed) {
                  setTodos([]);
                }
              }}
              >Clear All</button>

            </SortableContext>
          </DndContext>}

    </div>
  );
}

export default App;