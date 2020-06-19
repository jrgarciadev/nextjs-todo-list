import PropTypes from 'prop-types';
import MainLayout from '../layouts/main';
import TodoContainer from '../components/TodoContainer';
import { withUser } from '../hoc/withUser';
import UserNotLogged from '../components/UserNotLogged';

const Home = ({ user }) => {
  return (
    <MainLayout>
      <div className="container-wrapper">{!user ? <UserNotLogged /> : <TodoContainer />}</div>
      <style jsx>
        {`
          .container-wrapper {
            width: 100%;
            margin-top: 80px;
          }
        `}
      </style>
    </MainLayout>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};

export default withUser(Home);
