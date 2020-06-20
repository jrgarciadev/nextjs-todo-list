import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CreateTeamDialog from './create-dialog';

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

const EmptyTeam = ({ loading, onCreateTeam }) => {
  const [createTeamDialogActive, setCreateTeamDialogActive] = useState(false);

  const handleCloseTeamDialog = () => setCreateTeamDialogActive(false);

  //   const handleCreateTeam = (teamName) => console.log({ teamName });

  const classes = useStyles();

  return (
    <div className={classes.emptyContainer}>
      <CreateTeamDialog
        loading={loading}
        onCreate={onCreateTeam}
        open={createTeamDialogActive}
        onClose={handleCloseTeamDialog}
      />
      <img width="50%" src="/empty_teams.svg" alt="don't have a team" />
      <h1 className={classes.infoTitle}>You don&apos;t have a team</h1>
      <p className={classes.info}>
        You can create a team and then share the code with your team members
      </p>
      <Button
        onClick={() => setCreateTeamDialogActive(true)}
        className={classes.addTeamButton}
        variant="contained"
        color="primary"
      >
        <span>Create Team</span>
      </Button>
    </div>
  );
};

EmptyTeam.propTypes = {
  loading: PropTypes.bool,
  onCreateTeam: PropTypes.func,
};

export default EmptyTeam;
