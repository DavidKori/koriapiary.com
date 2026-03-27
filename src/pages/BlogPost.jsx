import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../styles/pages.css'

const BlogPost = () => {
  const { slug } = useParams();

  return (
    <>
      <SEO title={`Blog: ${slug}`} />
      <div className="blog-post-page">
        <h1>Blog Post: {slug}</h1>
      </div>
    </>
  );
};

export default BlogPost;