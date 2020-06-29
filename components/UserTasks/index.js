/* eslint-disable react/jsx-wrap-multilines */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import { CircularProgress } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import SendIcon from '@material-ui/icons/Send';
import Input from '@material-ui/core/Input';
import Card from '@material-ui/core/Card';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { useInputValue } from '../../hooks/useInputValue';
import AssignDialog from './assign-dialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
  },
  inputTodo: {
    padding: 20,
    width: '100%',
  },
  iconButton: {
    padding: 10,
  },
  skeleton: {
    height: '40px',
    marginTop: 10,
    marginBottom: 10,
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(10),
  },
  sendWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  addProgress: {
    color: 'var(--geist-primary)',
    position: 'absolute',
    top: -9,
    left: -11,
    zIndex: 1,
  },
  totalItemsText: {
    paddingLeft: 10,
    marginRight: 6,
    color: '#999999',
    textAlign: 'start',
  },
  inputListTodo: {
    '&:before': {
      borderBottom: '0px',
    },
  },
  listTextChecked: {
    textDecoration: 'line-through',
  },
  infoTitle: {
    padding: 0,
    margin: 0,
  },
  info: {
    color: 'var(--accents-3)',
  },
  footer: {
    display: 'flex',
  },
}));

const UserTasks = ({
  team = [],
  user,
  addLoading,
  items,
  onAdd,
  onRemove,
  onAssign,
  onToggle,
  onEdit,
  onUpdate,
}) => {
  const classes = useStyles();
  const newTodo = useInputValue('');
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const renderCompletedTodos = () => {
    const completedTodos = filter(items, 'completed');
    return (
      <p className={classes.totalItemsText}>
        Completed items:&nbsp;
        {completedTodos.length}
      </p>
    );
  };

  const handleAssignTask = (taskId, userId) => {
    onAssign(taskId, userId);
    setOpenAssignDialog(false);
  };

  const handleAddTodo = () => {
    // Clear txt input
    newTodo.onChange('');
    // Send to firebase
    onAdd(newTodo.value);
  };

  return (
    <Card className={classes.root}>
      <List component="nav" aria-label="main add-todo field">
        <Input
          {...newTodo}
          className={classes.inputTodo}
          onKeyPress={(event) => event.key === 'Enter' && handleAddTodo()}
          placeholder="Type here to add new task item.."
          inputProps={{ 'aria-label': 'description' }}
          endAdornment={
            <InputAdornment position="end">
              <Tooltip title="Send Todo">
                <IconButton
                  aria-label="Send Todo"
                  onClick={handleAddTodo}
                  disabled={newTodo.value.length < 2}
                >
                  <div className={classes.sendWrapper}>
                    <SendIcon color={newTodo.value.length < 2 ? 'disabled' : 'primary'} />
                    {addLoading && <CircularProgress size={44} className={classes.addProgress} />}
                  </div>
                </IconButton>
              </Tooltip>
            </InputAdornment>
          }
        />
      </List>

      {items && items.length < 1 && (
        <div className={classes.emptyContainer}>
          <img width="50%" src="/empty_todos.svg" alt="don't have todos" />
          <h1 className={classes.infoTitle}>You don&apos;t have tasks</h1>
          <p className={classes.info}>
            Here you will be able to see the tasks you create and the ones assigned to you
          </p>
        </div>
      )}

      <List className={classes.root}>
        {items.map((todo) => {
          const labelId = `checkbox-list-label-${todo.id}`;

          return (
            <ListItem key={todo.id} role={undefined} dense>
              {team && team.members && team.members.length > 1 && (
                <AssignDialog
                  user={user}
                  todoId={todo.id}
                  open={openAssignDialog}
                  onAssign={handleAssignTask}
                  members={team.members}
                  onClose={() => setOpenAssignDialog(false)}
                />
              )}
              <ListItemIcon>
                <Checkbox
                  onClick={onToggle(todo.id, 'completed', !todo.completed, true)}
                  edge="start"
                  checked={todo.completed}
                  tabIndex={-1}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <Input
                id={labelId}
                value={todo.text}
                onFocus={onToggle(todo.id, 'editable', true)}
                onBlur={() => onUpdate(todo)}
                className={[
                  classes.inputTodo,
                  classes.inputListTodo,
                  todo.completed && classes.listTextChecked,
                ]}
                onChange={(evt) => {
                  onEdit(todo.id, evt.target.value);
                }}
                placeholder="Edit todo item.."
                inputProps={{ 'aria-label': 'description' }}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Delete">
                  <IconButton edge="end" onClick={() => onRemove(todo.id)} aria-label="delete">
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
                {team && team.members && team.members.length > 1 && (
                  <Tooltip title="Assign To">
                    <IconButton
                      edge="end"
                      onClick={() => setOpenAssignDialog(true)}
                      aria-label="assign tasks"
                    >
                      <AssignmentInd color="primary" />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      {items.length > 0 && (
        <div className={classes.footer}>
          {renderCompletedTodos()}
          <p className={classes.totalItemsText}>
            Total items:&nbsp;
            {items.length}
          </p>
        </div>
      )}
    </Card>
  );
};

UserTasks.propTypes = {
  user: PropTypes.object,
  team: PropTypes.array,
  loading: PropTypes.bool,
  addLoading: PropTypes.bool,
  items: PropTypes.array,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onToggle: PropTypes.func,
  onAssign: PropTypes.func,
  onEdit: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default UserTasks;
