/* eslint-disable react/prop-types */
import { useState } from 'react';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import TabPanel from './tabpanel';
import TodoContainer from '../TodoContainer';
import TeamContainer from '../TeamContainer';

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const HomeContainer = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static" color="white">
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="tabs"
          centered
        >
          <Tab label="My tasks" icon={<PersonIcon />} {...a11yProps(0)} />
          <Tab label="My Team" icon={<PeopleIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TodoContainer />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TeamContainer />
      </TabPanel>
    </Container>
  );
};

export default HomeContainer;
