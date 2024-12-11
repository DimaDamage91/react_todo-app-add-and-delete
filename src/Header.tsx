import React, { useState } from 'react';

export const Header: React.FC<{ onAdd: (title: string) => void }> = ({ onAdd }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim()) {
      onAdd(newTodoTitle.trim());
      setNewTodoTitle('');
      inputRef.current?.focus();
    }
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
