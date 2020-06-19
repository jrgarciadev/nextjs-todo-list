import PropTypes from 'prop-types';
import Wrapper from './wrapper';

const Page = ({ children }) => (
  <main className="main">
    <Wrapper>{children}</Wrapper>
    <style jsx>
      {`
        .main {
          min-height: 100vh;
        }

        .main :global(> div) {
          display: flex;
          min-height: calc(100vh - 84px);
        }
      `}
    </style>
  </main>
);

Page.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Page;
