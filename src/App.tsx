import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Calendar, Trash2, Sun, Moon, Edit2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100 dark:bg-slate-800' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/50' },
  { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/50' },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('task781-tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('task781-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(36),
      title: newTaskTitle.trim(),
      dueDate: newTaskDue || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: newTaskPriority,
      status: 'todo',
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDue('');
    setNewTaskPriority('medium');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = () => {
    if (!editingTaskId || !editingTitle.trim()) {
      setEditingTaskId(null);
      return;
    }
    setTasks(tasks.map(t => 
      t.id === editingTaskId ? { ...t, title: editingTitle.trim() } : t
    ));
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === draggableId) {
        const newStatus = destination.droppableId as Task['status'];
        if (newStatus === 'done' && task.status !== 'done') {
          confetti({ particleCount: 180, spread: 80, origin: { y: 0.6 } });
        }
        return { ...task, status: newStatus };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getTasksByStatus = (status: Task['status']) => 
    filteredTasks.filter(t => t.status === status);

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date(new Date().toDateString());

  const priorityColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-rose-500',
  };

  const clearDoneTasks = () => {
    setTasks(tasks.filter(t => t.status !== 'done'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="font-black text-3xl tracking-tighter">781</span>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">Task781</h1>
              <p className="text-[10px] text-slate-400 -mt-1">BY MIRZA CAUSEVIC</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-2xl hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden md:block text-sm px-4 py-1.5 bg-slate-800 rounded-2xl text-slate-400">
              {tasks.length} tasks • {tasks.filter(t => t.status === 'done').length} completed
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-500 text-lg"
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          {/* Add Task Form */}
          <div className="flex gap-2 bg-slate-900 border border-slate-700 rounded-3xl p-2">
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="bg-transparent px-4 w-72 focus:outline-none"
            />
            <input
              type="date"
              value={newTaskDue}
              onChange={(e) => setNewTaskDue(e.target.value)}
              className="bg-slate-800 rounded-2xl px-4 text-sm"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="bg-slate-800 rounded-2xl px-4 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.985] transition-all px-8 rounded-2xl flex items-center gap-2 font-medium"
            >
              <Plus size={20} /> Add Task
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map(column => {
              const columnTasks = getTasksByStatus(column.id as Task['status']);
              return (
                <div key={column.id} className="flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full ${column.color.replace('100', '500').replace('900/50', '500')}`} />
                      <h2 className="font-semibold text-xl tracking-tight">{column.title}</h2>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-400">
                        {columnTasks.length}
                      </span>
                    </div>
                    {column.id === 'done' && columnTasks.length > 0 && (
                      <button
                        onClick={clearDoneTasks}
                        className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Clear
                      </button>
                    )}
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[520px] rounded-3xl p-4 transition-all ${column.color} ${snapshot.isDraggingOver ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-950' : ''}`}
                      >
                        {columnTasks.length === 0 && (
                          <div className="h-48 flex flex-col items-center justify-center text-slate-500">
                            <div className="text-5xl mb-3 opacity-30">📭</div>
                            <p className="text-sm">No tasks in this column</p>
                          </div>
                        )}

                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-4 shadow-xl group transition-all ${snapshot.isDragging ? 'shadow-2xl scale-[1.015] rotate-1' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div className={`px-4 py-1 text-xs font-bold tracking-widest rounded-full text-white ${priorityColors[task.priority]}`}>
                                    {task.priority.toUpperCase()}
                                  </div>
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => startEditing(task)} className="text-slate-400 hover:text-blue-400">
                                      <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-400">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>

                                {editingTaskId === task.id ? (
                                  <div className="flex gap-2 mb-4">
                                    <input
                                      type="text"
                                      value={editingTitle}
                                      onChange={(e) => setEditingTitle(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                      className="flex-1 bg-slate-800 rounded-xl px-4 py-2 text-lg font-medium focus:outline-none"
                                      autoFocus
                                    />
                                    <button onClick={saveEdit} className="bg-emerald-600 px-4 rounded-xl">
                                      <Check size={18} />
                                    </button>
                                  </div>
                                ) : (
                                  <h3 className="font-semibold text-[17px] leading-snug mb-4 pr-8 cursor-pointer" onClick={() => startEditing(task)}>
                                    {task.title}
                                  </h3>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                  <div className={`flex items-center gap-2 ${isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-400' : 'text-slate-400'}`}>
                                    <Calendar size={15} />
                                    <span>{task.dueDate}</span>
                                    {isOverdue(task.dueDate) && task.status !== 'done' && (
                                      <span className="text-[10px] font-bold text-red-400 ml-1">OVERDUE</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        <div className="mt-12 text-center text-xs text-slate-500">
          Drag tasks between columns • Built with ❤️ by Mirza Causevic • Data saved in your browser
        </div>
      </div>
    </div>
  );
}

export default App;
