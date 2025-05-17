// src/Componentes/Tareas/Componentes/TaskListMobile.jsx
import React from 'react';
import TaskCard from './TaskCard';

const TaskListMobile = ({ tasks, selectedTasks, setSelectedTasks, onEdit, onDelete, onToggleStatus, onClone }) => (
  <div className="space-y-4">
    {tasks.map((task) => (
      <TaskCard
        key={task.id}
        task={task}
        selectedTasks={selectedTasks}
        toggleSelectTask={(id) =>
          setSelectedTasks((prev) =>
            prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
          )
        }
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
        onClone={onClone}
      />
    ))}
  </div>
);

export default TaskListMobile;