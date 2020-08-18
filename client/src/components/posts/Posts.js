import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';
import { getPosts } from '../../actions/post';
import PropTypes from 'prop-types';

const Posts = ({ getPosts, post: { posts, loading }, auth: { user } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return loading || posts === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'>
          {' '}
          Welcome to the community, {user && user.name}{' '}
        </i>
      </p>

      <PostForm />
      <div className='posts'>
        {posts.length > 0 ? (
          posts.map((post) => <PostItem key={post._id} post={post} />)
        ) : (
          <h4> No Post Found.</h4>
        )}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts })(Posts);
