/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import cn from 'classnames';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { FilterOptions } from './types/FilterOptions';

const handleFilter = (todosToUse: Todo[], activeFilter: FilterOptions) => {
  let resultArray = [...todosToUse];

  if (activeFilter === FilterOptions.ACTIVE) {
    resultArray = resultArray.filter(todoItem => !todoItem.completed);
  }

  if (activeFilter === FilterOptions.COMPLETED) {
    resultArray = resultArray.filter(todoItem => todoItem.completed);
  }

  return resultArray;
};

export const App: React.FC = () => {
  const [todosToUse, setTodosToUse] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState(FilterOptions.ALL);

  useEffect(() => {
    getTodos()
      .then((todos: Todo[]) => {
        setTodosToUse(todos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const visibleTodos = handleFilter(todosToUse, activeFilter);

  const handleFilterChange = (newFilter: FilterOptions) => {
    setActiveFilter(newFilter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todosToUse.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {!errorMessage && visibleTodos.length > 0 && (
                <TodoList visibleTodos={visibleTodos} />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todosToUse.filter(todo => !todo.completed).length} items left
              </span>

              <Filter
                activeFilter={activeFilter}
                handleFilterChange={(string: FilterOptions) =>
                  handleFilterChange(string)
                }
              />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={todosToUse.every(todo => !todo.completed)}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
