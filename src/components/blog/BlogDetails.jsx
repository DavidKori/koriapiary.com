// src/components/blog/BlogDetails.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiClock, FiArrowLeft } from 'react-icons/fi';

const BlogDetails = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className="blog-details">
      <Link to="/blog" className="back-to-blog">
        <FiArrowLeft /> Back to Blog
      </Link>

      <header className="blog-header">
        <h1 className="blog-title">{post.title}</h1>
        
        <div className="blog-meta-large">
          <span className="meta-item">
            <FiCalendar />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          
          {post.author && (
            <span className="meta-item">
              <FiUser />
              {post.author.name}
            </span>
          )}
          
          {post.readingTime && (
            <span className="meta-item">
              <FiClock />
              {post.readingTime} min read
            </span>
          )}
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="blog-categories">
            {post.categories.map(cat => (
              <Link 
                key={cat._id} 
                to={`/blog?category=${cat.slug}`}
                className="category-link"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.featuredImage && (
        <div className="blog-featured-image">
          <img 
            src={post.featuredImage.url} 
            alt={post.featuredImage.alt || post.title}
          />
        </div>
      )}

      <div className="blog-content">
        {/* This would render the rich content from your editor */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="blog-tags">
          <h4>Tags:</h4>
          <div className="tags-list">
            {post.tags.map(tag => (
              <Link key={tag} to={`/blog?tag=${tag}`} className="tag">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetails;