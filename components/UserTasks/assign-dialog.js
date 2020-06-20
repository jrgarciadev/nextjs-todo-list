import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const AssignDialog = ({ user, onClose, onAssign, open, todoId, members }) => {
  const handleClose = () => {
    onClose();
  };

  const handleAssing = (userId) => {
    onAssign(todoId, userId);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Click user to assign tasks</DialogTitle>
      <List>
        {members.map((member) => {
          if (member.uid === user.uid) return null;
          return (
            <ListItem button onClick={() => handleAssing(member.uid)} key={member.uid}>
              <ListItemAvatar>
                <Avatar alt={`${member.displayName} Avatar`} src={member.photoURL} />
              </ListItemAvatar>
              <ListItemText primary={member.displayName} />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};

AssignDialog.propTypes = {
  user: PropTypes.object.isRequired,
  todoId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  members: PropTypes.array,
};

export default AssignDialog;
