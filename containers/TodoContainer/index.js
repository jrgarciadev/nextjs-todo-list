/* eslint-disable react/prop-types */
import { useState } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import UserTasks from '../../components/UserTasks';

const TodoContainer = ({ items, onSetTodo, onAddTodo, firebase, team, user }) => {
  const [addLoading, setAddLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddTodo = async (text) => {
    setAddLoading(true);
    const todoToServer = {
      author: user.uid,
      completed: false,
      text,
    };
    const todoAdded = await firebase.saveData({ collection: 'todos', data: todoToServer });
    onAddTodo(todoAdded, text);
    setAddLoading(false);
  };

  const handleRemoveTodo = async (id) => {
    onSetTodo(items.filter((todo) => todo.id !== id));
    await firebase.deleteDocument({ collection: 'todos', id });
  };

  // const filterTodo = (id) => first(filter(userTodos, (todo) => todo.id === id));

  const handleUpdateTodo = (todoObj) => {
    const todoRef = firebase.getRef({ collection: 'todos', doc: todoObj.id });
    if (todoRef) {
      todoRef.update({ ...todoObj });
    }
  };

  const handleToggle = (id, field, val, save = false) => () => {
    const tmpTodos = map(items, (todo) => {
      const tmpTodo = todo;
      if (tmpTodo.id === id) {
        tmpTodo[field] = val;
      }
      if (save) {
        handleUpdateTodo(tmpTodo);
      }
      return tmpTodo;
    });
    onSetTodo(tmpTodos);
  };

  const handleEditTodo = (id, text) => {
    const tmpTodos = map(items, (todo) => {
      const tmpTodo = todo;
      if (tmpTodo.id === id) {
        tmpTodo.text = text;
      }
      return tmpTodo;
    });
    onSetTodo(tmpTodos);
  };

  const handleAssignTodo = (id, userId) => {
    let tmpTodos = map(items, (todo) => {
      const tmpTodo = todo;
      if (tmpTodo.id === id) {
        tmpTodo.author = userId;
        tmpTodo.assigning = true;
        handleUpdateTodo(tmpTodo);
        enqueueSnackbar('Task assigned succesfully', { variant: 'success' });
      }
      return tmpTodo;
    });
    tmpTodos = tmpTodos.filter((item) => item.id !== id);
    onSetTodo(tmpTodos);
  };

  return (
    <UserTasks
      user={user}
      team={team}
      items={items}
      onAdd={handleAddTodo}
      onAssign={handleAssignTodo}
      onEdit={handleEditTodo}
      onRemove={handleRemoveTodo}
      onToggle={handleToggle}
      addLoading={addLoading}
      onUpdate={handleUpdateTodo}
    />
  );
};

TodoContainer.propTypes = {
  items: PropTypes.array,
  firebase: PropTypes.any,
  onSetTodo: PropTypes.func,
  team: PropTypes.any,
  user: PropTypes.object,
};
export default TodoContainer;
