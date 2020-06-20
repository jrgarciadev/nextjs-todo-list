/* eslint-disable react/prop-types */
import { memo, useState, useContext } from 'react';
import { first, isEmpty } from 'lodash';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { EmptyTeam, UserTeam } from '../../components/UserTeam';
import { AuthContext } from '../../contexts/auth';

const TeamContainer = memo(({ firebase, team, user, onSetTeam }) => {
  const { updateUser } = useContext(AuthContext);
  const [progress, setProgress] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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

  const handleCreateTeam = async (teamName) => {
    setProgress(true);

    const teamCode = new Date().getUTCMilliseconds();

    // Fetch auth user ref
    const authRef = await firebase.authRef();

    const teamToServer = {
      author: user.uid,
      name: teamName,
      code: teamCode,
      members: [authRef],
      createdAt: new Date(),
    };

    const todoAdded = await firebase.saveData({ collection: 'teams', data: teamToServer });

    // Add team to user collection
    authRef.update({ team: todoAdded.id });
    // Update local saved user
    // eslint-disable-next-line no-param-reassign
    user.team = todoAdded.id;
    if (todoAdded.members.length > 0) {
      await completeTeamMembersData(todoAdded);
    }
    updateUser(user);
    onSetTeam(todoAdded);
    setProgress(false);
  };

  const handleJoinTeam = async (teamCode) => {
    setProgress(true);
    const teams = await firebase.getCollectionData({
      collection: 'teams',
      where: { field: 'code', op: '==', value: teamCode },
      addRef: true,
    });

    const foundTeam = first(teams);

    if (!isEmpty(foundTeam)) {
      // Fetch auth user ref
      const authRef = await firebase.authRef();
      // Fetch document ref
      const teamRef = await firebase.getRef({ collection: 'teams', doc: foundTeam.id });
      foundTeam.members.push(authRef);
      teamRef.update({ members: foundTeam.members });
      // Add team to user collection
      authRef.update({ team: foundTeam.id });
      // Update local saved user
      // eslint-disable-next-line no-param-reassign
      user.team = foundTeam.id;
      if (foundTeam.members.length > 0) {
        await completeTeamMembersData(foundTeam);
      }
      updateUser(user);
      onSetTeam(foundTeam);
    } else {
      enqueueSnackbar('Team not found, review the team code', { variant: 'error' });
    }

    setProgress(false);
  };

  if (isEmpty(team)) {
    return (
      <EmptyTeam onCreateTeam={handleCreateTeam} onJoinTeam={handleJoinTeam} loading={progress} />
    );
  }

  return <UserTeam team={team} />;
});

TeamContainer.propTypes = {
  firebase: PropTypes.any,
  team: PropTypes.any,
  user: PropTypes.object,
  onSetTeam: PropTypes.func,
};
export default TeamContainer;
