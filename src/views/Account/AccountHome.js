import React, { PureComponent } from 'react';
import {
  Container,
  Button,
  Grid,
  Image,
  Header,
  Statistic,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';
import Translated from '../Translated';
import DateView from '../DateView';
import actions from '../../actions';

const { Column: Col, Row } = Grid;
const DEFAULT_AVATAR =
  'https://imgplaceholder.com/300x300/030306/549cea/fa-user';

/**
 * The page that displays all basic account info
 *
 * @class      AccountHome (name)
 */
class AccountHome extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    token: PropTypes.string,
    removeToken: PropTypes.func.isRequired,
  };

  componentDidUpdate() {
    const { data: { loading, viewer }, removeToken } = this.props;

    if (!loading && !viewer) {
      removeToken();
    }
  }

  render() {
    const {
      data: { loading, error, viewer, posts, users },
      token,
    } = this.props;

    if (!token) return <Redirect to="/login" />;

    if (loading) return <Loading />;

    if (error) return <ErrorMessage value={error} />;

    if (!viewer) return <Redirect to="/login" />;

    return (
      <Container as="main" textAlign="center" className="account-page" text>
        <Grid>
          <Row centered>
            <Col computer={4} tablet={6} mobile={8}>
              <Image src={viewer.avatar || DEFAULT_AVATAR} rounded />
            </Col>
            <Col
              computer={7}
              tablet={9}
              mobile={16}
              verticalAlign="middle"
              textAlign="left"
              className="account-info"
            >
              <Row>
                <Header inverted as="h3">
                  {viewer.name}
                  {viewer.isAdmin && (
                    <span className="admin-label">
                      (<Translated id="admin" />)
                    </span>
                  )}
                </Header>
              </Row>
              <Row>
                <Translated id="email" />:{' '}
                {viewer.email || <Translated id="none" />}
              </Row>
              <Row>
                <Translated id="joinedAt" />:{' '}
                <DateView value={viewer.createdDate} />
              </Row>
              <Row as={Link} to="/account/edit">
                <Translated id="edit" />
              </Row>
            </Col>
          </Row>
          {viewer.isAdmin && (
            <Row divided centered>
              <Col width={16}>
                <Statistic.Group
                  widths={2}
                  color="blue"
                  inverted
                  className="stat-container"
                >
                  <Statistic as={Link} to={`/account/posts/editor`}>
                    <Statistic.Value>{posts.totalCount}</Statistic.Value>
                    <Translated
                      as={Statistic.Label}
                      id="post"
                      variables={posts.totalCount}
                    />
                  </Statistic>
                  <Statistic>
                    <Statistic.Value>{users.totalCount}</Statistic.Value>
                    <Translated
                      as={Statistic.Label}
                      id="user"
                      variables={users.totalCount}
                    />
                  </Statistic>
                </Statistic.Group>
              </Col>
            </Row>
          )}
          <Row centered>
            <Translated
              inverted
              as={Button}
              id="logout"
              basic
              color="blue"
              onClick={this.props.removeToken}
            />
          </Row>
        </Grid>
      </Container>
    );
  }
}

const viewerInfo = gql`
  {
    viewer {
      id
      name
      avatar
      email
      createdDate
      isAdmin
    }
    posts {
      totalCount
    }
    users {
      totalCount
    }
  }
`;

const mapStateToProps = state => ({ token: state.token });

const mapDispatchToProps = dispatch => ({
  removeToken: token =>
    dispatch({
      type: actions.REMOVE_TOKEN,
      token,
    }),
});

export { AccountHome as AccountHomeView };

export default connect(mapStateToProps, mapDispatchToProps)(
  graphql(viewerInfo)(AccountHome)
);
