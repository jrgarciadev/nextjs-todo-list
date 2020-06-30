import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useClipboard } from 'use-clipboard-copy';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useSnackbar } from 'notistack';
import TeamList from './team-list';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  media: {
    height: '100%',
  },
  codeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const UserTeam = ({ team }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const clipboard = useClipboard();

  const handleCopyTeamCode = useCallback(() => {
    clipboard.copy(`${team.code}`);
    enqueueSnackbar('The team code has been copied');
  }, [clipboard.copy, team.code]);

  const renderTeamCode = () => (
    <div className={classes.codeContainer}>
      <Tooltip title="Share this code to add new members">
        <IconButton aria-label="Share this code to add new members" onClick={handleCopyTeamCode}>
          <FileCopyOutlined />
        </IconButton>
      </Tooltip>

      <Typography variant="h6" color="textSecondary" component="h2">
        Code:&nbsp;
        {team.code}
      </Typography>
    </div>
  );

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {team.name}
        </Typography>
        {renderTeamCode()}

        {team.members && team.members.length > 0 ? (
          <TeamList author={team.author} members={team.members} />
        ) : (
          <p>You are the only member</p>
        )}
      </CardContent>
    </Card>
  );
};

UserTeam.propTypes = {
  team: PropTypes.object,
};

export default UserTeam;
