/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonIcon from '@material-ui/icons/Person';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { map } from 'lodash';
import TabPanel from './tabpanel';
import UserTasks from '../UserTasks';
import { withFirebase } from '../../hoc/withFirebase';
import { withUser } from '../../hoc/withUser';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const TodoContainer = ({ firebase, user }) => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [userTodos, setUserTodos] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
    <Container maxWidth="md">
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="tabs"
          centered
        >
          <Tab label={`(${userTodos.length}) My tasks`} icon={<PersonIcon />} {...a11yProps(0)} />
          <Tab label="(10) Assigned Tasks" icon={<AssignmentIcon />} {...a11yProps(1)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <h1>Assignment Tasks</h1>
      </TabPanel>
    </Container>
  );
};

export default withFirebase(withUser(TodoContainer));
