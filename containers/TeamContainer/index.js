/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { first, isEmpty } from 'lodash';
import { CircularProgress } from '@material-ui/core';
import { EmptyTeam, UserTeam } from '../../components/UserTeam';
import { withFirebase } from '../../hoc/withFirebase';
import { withUser } from '../../hoc/withUser';

const TeamContainer = ({ firebase, user }) => {
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const teams = await firebase.getCollectionData({
        collection: 'teams',
        where: { field: 'author', op: '==', value: user.uid },
      });
      console.log({ teams });
      setTeam(first(teams));
      setLoading(false);
    }
    fetchData();
  }, []);

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
    return <EmptyTeam />;
  }

  return <UserTeam loading={loading} team={team} />;
};

export default withFirebase(withUser(TeamContainer));
