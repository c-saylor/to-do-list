import React from 'react';
import { Todo } from '../types/todo';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  todo: Todo ;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDragEnabled: boolean;
}

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, isDragEnabled}) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: todo.id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <li
        ref={setNodeRef}
        style={{ ...style, cursor: 'default' }}
        className={`todo-item ${todo.completed ? 'completed' : ''}`}
      >
        <span 
            {...(isDragEnabled ? listeners : {})} 
            {...(isDragEnabled ? attributes: {})} 
            style={{ cursor: 'grab', userSelect: 'none', marginRight: '1rem'}} 
            aria-label="Drag handle"
        >
            {isDragEnabled ? '☰' : ''}
        </span>
        <span style={{cursor: 'pointer'}} onClick={() => onToggle(todo.id)}>{todo.text}</span>
        <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // prevents click from affecting drag
          onDelete(todo.id);
        }}
      >
        🗑️
      </button>
      </li>
    );
  };
  

export default TodoItem;