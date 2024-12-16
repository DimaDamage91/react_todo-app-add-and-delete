import classNames from 'classnames';
import React, { useState } from 'react';

export const Header: React.FC<{ onAdd: (title: string) => void; isAdding: boolean; }> = ({ onAdd, isAdding }) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
   onAdd(newTodoTitle.trim());

  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className={classNames('todoapp__new-todo', {
            'todoapp__new-todo--disabled' : isAdding,
          })}
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
