// src/components/blog/BlogGrid.jsx
import React from 'react';
import BlogCard from './BlogCard';

const BlogGrid = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="no-posts">
        <h3>No blog posts found</h3>
        <p>Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="blog-grid">
      {posts.map(post => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default BlogGrid;