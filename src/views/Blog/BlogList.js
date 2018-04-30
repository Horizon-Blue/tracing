import React, { PureComponent } from 'react';
import { Container } from 'semantic-ui-react';
import { Seq } from 'immutable';
import PropTypes from 'prop-types';
import BlogListItem from './BlogListItem';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Loading from '../Loading';
import ErrorMessage from '../ErrorMessage';

/**
 * The content to shows on the blog list page
 *
 * @class      BlogList (name)
 */
class BlogList extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    query: PropTypes.string,
  };

  /**
   * Given each post, render it as an entry in the blog list
   *
   * @param      {object}  post    The post
   * @return     {Node}  the rendered React component
   */
  renderPostItem({ node: post }) {
    return <BlogListItem key={post.id} post={post} />;
  }

  render() {
    const { data: { loading, posts, error } } = this.props;

    if (loading) return <Loading />;

    if (error) return <ErrorMessage value={error} />;

    return (
      <Container as="main">
        {Seq(posts.edges)
          .reverse()
          .map(this.renderPostItem)}
      </Container>
    );
  }
}

const getAllPosts = gql`
  query($query: String) {
    posts(query: $query) {
      edges {
        node {
          id
          title
          excerpt
          category {
            id
            name
          }
          tags {
            edges {
              node {
                id
                name
              }
            }
          }
          author {
            id
            name
          }
          publishDate
        }
      }
    }
  }
`;

export { BlogList as BlogListView };
export default graphql(getAllPosts, {
  options: ({ query }) => ({
    variables: { query },
  }),
})(BlogList);
