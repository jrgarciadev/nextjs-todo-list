/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { useInputValue } from '../../hooks/useInputValue';

const useStyles = makeStyles(() => ({
  progressContainer: {
    display: 'flex',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
}));

const CreateTeamDialog = ({ open, loading, onCreate, onClose }) => {
  const teamName = useInputValue('');
  const classes = useStyles();
  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Creeate a team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create a team and then share code with your team members, split your work
            sharing tasks with your team.
          </DialogContentText>
          <TextField
            {...teamName}
            onKeyPress={(event) =>
              event.key === 'Enter' && teamName.value.length >= 3 && onCreate(teamName.value)
            }
            autoFocus
            disabled={loading}
            margin="dense"
            id="teamname"
            label="Team Name"
            type="text"
            fullWidth
          />
          {loading && (
            <div className={classes.progressContainer}>
              <CircularProgress color="primary" />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={loading || teamName.value.length < 3}
            variant="contained"
            onClick={() => onCreate(teamName.value)}
            color="primary"
          >
            Create Team
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

CreateTeamDialog.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
};

export default CreateTeamDialog;
