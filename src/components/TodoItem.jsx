import { useState } from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

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

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        todo.completed ? 'bg-purple-50/50' : 'bg-white/40'
      } hover:bg-white/60 group`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-purple-500 border-purple-500'
            : 'border-purple-300 hover:border-purple-500'
        }`}
      >
        {todo.completed && <Check size={12} className="text-white" />}
      </button>

      {/* Text */}
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-500 py-1"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${
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
            className="p-1 rounded-lg hover:bg-purple-100 text-gray-400 hover:text-purple-600"
          >
            <Edit2 size={14} />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
