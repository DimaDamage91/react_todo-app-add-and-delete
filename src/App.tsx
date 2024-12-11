/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { ErrorNotification } from './ErrorNotification';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';

import * as todoService from '../src/api/todos';
import { Todo } from '../src/types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleError = (errorType: string) => {
    switch (errorType) {
      case 'load':
        setError('Unable to load todos');
        break;
      case 'add':
        setError('Unable to add a todo');
        break;
      case 'delete':
        setError('Unable to delete a todo');
        break;
      case 'update':
        setError('Unable to update a todo');
        break;
      default:
        setError('An unknown error occured');
    }
    setIsErrorVisible(true);
  };

  function deleteTodo(todoId: number) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isLoading: true } : todo
      )
    );

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) =>
          currentTodos.filter((todo) => todo.id !== todoId)
        );
      })
      .catch(() => {
        handleError('delete');
        setTodos((currentTodos) =>
          currentTodos.map((todo) =>
            todo.id === todoId ? { ...todo, isLoading: false } : todo
          )
        );
      });
  }

  function addTodo({ title, userId, completed }: Todo) {
    if (!title.trim()) {
      setError('Title should not be empty');
      setIsErrorVisible(true);
      return;
    }

    const temporaryTodo = {
      id: 0,
      title,
      userId,
      completed,
    };

    setTempTodo(temporaryTodo);
    setIsAdding(true);

    todoService
      .createTodo({ title: title.trim(), userId, completed })
      .then((newTodo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        handleError('add');
      })
      .finally(() => {
        setIsAdding(false);
      });
  }

  function clearCompletedTodos() {
    const completedTodos = todos.filter((todo) => todo.completed);

    Promise.allSettled(
      completedTodos.map((todo) =>
        todoService.deleteTodo(todo.id).catch(() => {
          handleError('delete');
        })
      )
    ).then(() => {
      setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
    });
  }

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todosData = await todoService.getTodos();
        setTodos(todosData);
        setError(null);
      } catch (err) {
        handleError('load');
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={(title) => addTodo({ title, userId: USER_ID, completed: false })} />
        <TodoList todos={todos} setTodos={setTodos} filter={filter} onDelete={deleteTodo}/>
        {todos.length > 0 && (
          <Footer todos={todos} filter={filter} setFilter={setFilter} clearCompletedTodos={clearCompletedTodos}/>
        )}
      </div>
      <ErrorNotification
        error={isErrorVisible ? error : null}
        onClose={() => {
          setIsErrorVisible(false);
          setError(null);
        }}
      />
    </div>
  );
};
