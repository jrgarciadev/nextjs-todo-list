import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CreateTeamDialog from './create-dialog';
import JoinTeamDialog from './join-dialog';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: theme.palette.background.paper,
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
  addTeamButton: {
    width: '40%',
    padding: '15px 20px',
    marginBottom: theme.spacing(2),
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

const EmptyTeam = ({ loading, onCreateTeam, onJoinTeam }) => {
  const [createTeamDialogActive, setCreateTeamDialogActive] = useState(false);
  const [joinTeamDialogActive, setJoinTeamDialogActive] = useState(false);

  const handleCloseTeamDialog = () => setCreateTeamDialogActive(false);
  const handleCloseJoinTeamDialog = () => setJoinTeamDialogActive(false);

  const handleCreateTeamLocal = async (teamName) => {
    await onCreateTeam(teamName);
    setCreateTeamDialogActive(false);
  };

  const handleJoinTeamLocal = async (teamCode) => {
    await onJoinTeam(parseInt(teamCode, 10));
    setJoinTeamDialogActive(false);
  };

  const classes = useStyles();

  return (
    <div className={classes.emptyContainer}>
      <CreateTeamDialog
        loading={loading}
        onCreate={handleCreateTeamLocal}
        open={createTeamDialogActive}
        onClose={handleCloseTeamDialog}
      />
      <JoinTeamDialog
        loading={loading}
        onCreate={handleJoinTeamLocal}
        open={joinTeamDialogActive}
        onClose={handleCloseJoinTeamDialog}
      />
      <img width="50%" src="/empty_teams.svg" alt="don't have a team" />
      <h1 className={classes.infoTitle}>You don&apos;t have a team</h1>
      <p className={classes.info}>You can create a team or you can join one with the code;</p>
      <Button
        onClick={() => setCreateTeamDialogActive(true)}
        className={classes.addTeamButton}
        variant="contained"
        color="primary"
      >
        <span>Create Team</span>
      </Button>
      <Button
        onClick={() => setJoinTeamDialogActive(true)}
        className={classes.addTeamButton}
        variant="outlined"
        color="primary"
      >
        <span>Join Team</span>
      </Button>
    </div>
  );
};

EmptyTeam.propTypes = {
  loading: PropTypes.bool,
  onCreateTeam: PropTypes.func,
  onJoinTeam: PropTypes.func,
};

export default EmptyTeam;
