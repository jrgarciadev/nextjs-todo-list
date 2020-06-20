/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { map } from 'lodash';
import UserTasks from '../../components/UserTasks';
import { withFirebase } from '../../hoc/withFirebase';
import { withUser } from '../../hoc/withUser';

const TodoContainer = ({ firebase, user }) => {
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [userTodos, setUserTodos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let todos = await firebase.getCollectionData({
        collection: 'todos',
        where: { field: 'author', op: '==', value: user.uid },
      });
      todos = todos.map((todo) => {
        return { ...todo, editable: false };
      });
      console.log({ todos });
      setUserTodos(todos);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAddTodo = async (text) => {
    setAddLoading(true);
    const todoToServer = {
      author: user.uid,
      completed: false,
      text,
    };

    const todoAdded = await firebase.saveData({ collection: 'todos', data: todoToServer });

    setUserTodos((oldTodos) => [
      ...oldTodos,
      { id: todoAdded.id, text, completed: false, editable: false },
    ]);
    setAddLoading(false);
  };

  const handleRemoveTodo = async (id) => {
    setUserTodos(userTodos.filter((todo) => todo.id !== id));
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
    const tmpTodos = map(userTodos, (todo) => {
      const tmpTodo = todo;
      if (tmpTodo.id === id) {
        tmpTodo[field] = val;
      }
      if (save) {
        handleUpdateTodo(tmpTodo);
      }
      return tmpTodo;
    });
    setUserTodos(tmpTodos);
  };

  const handleEditTodo = (id, text) => {
    const tmpTodos = map(userTodos, (todo) => {
      const tmpTodo = todo;
      if (tmpTodo.id === id) {
        tmpTodo.text = text;
      }
      return tmpTodo;
    });
    setUserTodos(tmpTodos);
  };

  return (
    <UserTasks
      loading={loading}
      items={userTodos}
      onAdd={handleAddTodo}
      onEdit={handleEditTodo}
      onRemove={handleRemoveTodo}
      onToggle={handleToggle}
      addLoading={addLoading}
      onUpdate={handleUpdateTodo}
    />
  );
};

export default withFirebase(withUser(TodoContainer));
