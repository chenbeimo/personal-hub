import { useState } from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit, index = 0 }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleToggle = () => {
    setIsChecking(true);
    setTimeout(() => {
      onToggle(todo.id);
      setIsChecking(false);
    }, 300);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(todo.id);
    }, 300);
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        todo.completed ? 'bg-purple-50/50' : 'bg-white/40'
      } hover:bg-white/60 group ${
        isDeleting ? 'animate-slide-out-left' : ''
      } ${isChecking ? 'animate-success-flash' : ''}`}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Checkbox with animation */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 btn-press ${
          todo.completed
            ? 'bg-purple-500 border-purple-500 scale-110'
            : 'border-purple-300 hover:border-purple-500 hover:scale-105'
        } ${isChecking ? 'animate-pulse-glow' : ''}`}
      >
        {todo.completed && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-checkmark"
              style={{
                strokeDasharray: 20,
                strokeDashoffset: 0,
              }}
            />
          </svg>
        )}
      </button>

      {/* Text */}
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-500 py-1 input-glow"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 transition-all duration-300 ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {todo.text}
        </span>
      )}

      {/* Category */}
      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600">
        {todo.category}
      </span>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded-lg hover:bg-purple-100 text-gray-400 hover:text-purple-600 btn-press"
          >
            <Edit2 size={14} />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 btn-press"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
