// src/components/home/BlogPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import BlogCard from '../blog/BlogCard';

const BlogPreview = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="blog-preview">
      <div className="section-header">
        <h2>Latest from Our Blog</h2>
        <Link to="/blog" className="view-all">
          View All <FiArrowRight />
        </Link>
      </div>

      <div className="blog-grid">
        {posts.map(post => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;