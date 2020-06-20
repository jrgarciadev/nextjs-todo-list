import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TeamList from './team-list';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  media: {
    height: '100%',
  },
});

const UserTeam = ({ team }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {team.name}
        </Typography>
        <Typography variant="h6" color="textSecondary" component="h2">
          Code:
          {team.code}
        </Typography>
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
