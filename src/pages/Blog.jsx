import React from 'react';
import SEO from '../components/common/SEO';
import '../styles/pages.css'

const Blog = () => {
  return (
    <>
      <SEO title="Blog" description="Read our latest articles about honey and beekeeping" />
      <div className="blog-page">
        <h1>Blog</h1>
        <p>Blog posts coming soon...</p>
      </div>
    </>
  );
};

export default Blog;