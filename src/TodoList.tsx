import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types/Todo';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: FilterType;
  onDelete: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, tempTodo, filter, onDelete }) => {

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const todosToRender = tempTodo
    ? [tempTodo, ...filteredTodos]
    : filteredTodos;


  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToRender.map(todo => (
        <TodoItem key={todo.id || 'temp'} todo={todo} onDelete={onDelete} />
      ))}
    </section>
  );
}
