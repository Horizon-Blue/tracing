import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import BlogList from './BlogList';
import BlogPost from './BlogPost';

class Blog extends PureComponent {
  render() {
    return (
      <Switch>
        <Route exact path="/blog" component={BlogList} />
        <Route path="/blog/:postId" component={BlogPost} />
      </Switch>
    );
  }
}

export default Blog;
