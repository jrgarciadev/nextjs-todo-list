/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import { first, isEmpty } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import TabPanel from './tabpanel';
import TodoContainer from '../TodoContainer';
import TeamContainer from '../TeamContainer';
import { withFirebase } from '../../hoc/withFirebase';
import { withUser } from '../../hoc/withUser';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const HomeContainer = ({ firebase, user }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(null);
  const [userTodos, setUserTodos] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const completeTeamMembersData = async (teamObj) => {
    const memberPromises = [];
    const { members } = teamObj;
    members.forEach((member) => {
      memberPromises.push(member.get());
    });
    const memebersData = await Promise.all(memberPromises);
    if (memebersData && memebersData.length > 0) {
      memebersData.forEach((member, index) => {
        members[index] = member.data();
      });
    }
    return members;
  };

  async function fetchData() {
    setLoading(true);
    const teams = await firebase.getCollectionData({
      collection: 'teams',
      where: { field: 'author', op: '==', value: user.uid },
    });
    const ownedTeam = first(teams);
    if (!isEmpty(ownedTeam)) {
      if (ownedTeam.members.length > 0) {
        const teamMembers = await completeTeamMembersData(ownedTeam);
        ownedTeam.membersData = teamMembers;
      }
      setTeam(ownedTeam);
    }
    setLoading(false);
  }

  async function fetchJoinedData() {
    setLoading(true);
    const joinedTeam = await firebase.getDocumentData({
      collection: 'teams',
      documentId: user.team,
    });
    if (!isEmpty(joinedTeam)) {
      if (joinedTeam.members.length > 0) {
        const teamMembers = await completeTeamMembersData(joinedTeam);
        joinedTeam.membersData = teamMembers;
      }
      setTeam(joinedTeam);
    }
    setLoading(false);
  }

  const handleAddTodo = (addTodo, text) => {
    const newTodo = { id: addTodo.id, text, completed: false, editable: false };
    // Add todo to the beginnning of array
    userTodos.unshift(newTodo);
    setUserTodos(userTodos);
  };

  // To fetch team data
  useEffect(() => {
    if (isEmpty(user.team)) {
      fetchData();
    } else if (!isEmpty(user.team)) {
      fetchJoinedData();
    }
  }, []);

  // To fetch TODOS data
  useEffect(() => {
    async function fetchTodosData() {
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
    fetchTodosData();
  }, []);

  // To fetch realtime task assigned
  useEffect(() => {
    const unsubscribe = firebase.db.collection('todos').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const myDataArray = [];
        snapshot.forEach((doc) => {
          const rtTodo = doc.data();
          // If has been assigned to auth user
          if (rtTodo.assigning && rtTodo.author === user.uid) {
            myDataArray.push({ ...rtTodo });
            const rtTodoRef = firebase.getRef({ collection: 'todos', doc: doc.id });
            // Update flag
            rtTodoRef.update({ assigning: false });
            // Update current state
            handleAddTodo(rtTodo, rtTodo.text);
          }
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [firebase]);

  if (loading)
    return (
      <div className="loading-container">
        <h2>Loading Application...</h2>
        <CircularProgress size={68} />
        <style jsx>
          {`
            .loading-container {
              width: 100%;
              height: 80%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </div>
    );

  return (
    <Container maxWidth="md">
      <AppBar position="static" color="white">
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChangeTab}
          aria-label="tabs"
          centered
        >
          <Tab label="My tasks" icon={<PersonIcon />} {...a11yProps(0)} />
          <Tab label="My Team" icon={<PeopleIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <TodoContainer
          items={userTodos}
          firebase={firebase}
          team={team}
          user={user}
          onSetTodo={(items) => setUserTodos(items)}
          onAddTodo={handleAddTodo}
        />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <TeamContainer
          firebase={firebase}
          team={team}
          user={user}
          onSetTeam={(payloadTeam) => setTeam(payloadTeam)}
        />
      </TabPanel>
    </Container>
  );
};

export default withUser(withFirebase(HomeContainer));
