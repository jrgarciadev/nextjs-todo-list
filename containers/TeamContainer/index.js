/* eslint-disable react/prop-types */
import { memo, useState, useEffect, useContext } from 'react';
import { first, isEmpty } from 'lodash';
import { CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { EmptyTeam, UserTeam } from '../../components/UserTeam';
import { withFirebase } from '../../hoc/withFirebase';
import { withUser } from '../../hoc/withUser';
import { AuthContext } from '../../contexts/auth';

const TeamContainer = memo(({ firebase, user }) => {
  const { updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [team, setTeam] = useState(null);
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

  async function fetchData() {
    setLoading(true);
    const teams = await firebase.getCollectionData({
      collection: 'teams',
      where: { field: 'author', op: '==', value: user.uid },
    });
    const ownedTeam = first(teams);
    if (!isEmpty(ownedTeam)) {
      if (ownedTeam.members.length > 0) {
        const teamMembers = await completeTeamMembersData(ownedTeam);
        ownedTeam.membersData = teamMembers;
      }
      setTeam(ownedTeam);
    }
    setLoading(false);
  }

  async function fetchJoinedData() {
    setLoading(true);
    const joinedTeam = await firebase.getDocumentData({
      collection: 'teams',
      documentId: user.team,
    });
    if (!isEmpty(joinedTeam)) {
      if (joinedTeam.members.length > 0) {
        const teamMembers = await completeTeamMembersData(joinedTeam);
        joinedTeam.membersData = teamMembers;
      }
      setTeam(joinedTeam);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isEmpty(user.team)) {
      fetchData();
    } else if (!isEmpty(user.team)) {
      fetchJoinedData();
    }
  }, []);

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
    setTeam(todoAdded);
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
      setTeam(foundTeam);
    } else {
      enqueueSnackbar('Team not found, review the team code', { variant: 'error' });
    }

    setProgress(false);
  };

  if (loading)
    return (
      <div className="container">
        <h1>loading teams...&nbsp;</h1>
        <CircularProgress size={44} />
        <style jsx>
          {`
            .container {
              display: flex;
              width: 100%;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </div>
    );

  if (isEmpty(team)) {
    return (
      <EmptyTeam onCreateTeam={handleCreateTeam} onJoinTeam={handleJoinTeam} loading={progress} />
    );
  }

  return <UserTeam loading={loading} team={team} />;
});

export default withFirebase(withUser(TeamContainer));
