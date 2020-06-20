import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const TeamList = ({ author, members = [] }) => {
  const classes = useStyles();

  return (
    <List dense className={classes.root}>
      {members.map((member) => {
        const labelId = `checkbox-list-secondary-label-${member.uid}`;
        return (
          <ListItem key={member.uid}>
            <ListItemAvatar>
              <Avatar alt={`${member.displayName} Avatar`} src={member.photoURL} />
            </ListItemAvatar>
            <ListItemText id={labelId} primary={member.displayName} />
            {author === member.uid && (
              <ListItemSecondaryAction>
                <Chip label="Owner" />
              </ListItemSecondaryAction>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

TeamList.propTypes = {
  members: PropTypes.array,
  author: PropTypes.string,
};
export default TeamList;
