import React from 'react';
import { Todo } from './types/Todo';

interface FooterProps {
  todos: Todo[];
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  clearCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = ({ todos, filter, setFilter, clearCompletedTodos}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={filter === 'all' ? 'selected' : ''}
          onClick={() => setFilter('all')}
          data-cy="FilterLinkAll"
        >
          All
        </a>
        <a
          href="#/active"
          className={filter === 'active' ? 'selected' : ''}
          onClick={() => setFilter('active')}
          data-cy="FilterLinkActive"
        >
          Active
        </a>
        <a
          href="#/completed"
          className={filter === 'completed' ? 'selected' : ''}
          onClick={() => setFilter('completed')}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompletedTodos}
        disabled={todos.every((todo) => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
