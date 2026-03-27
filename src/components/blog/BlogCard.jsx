// src/components/blog/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <article className="blog-card futuristic-card">
      <Link to={`/blog/${post.slug}`} className="blog-link">
        {post.featuredImage && (
          <div className="blog-image-container">
            <img 
              src={post.featuredImage.url} 
              alt={post.featuredImage.alt || post.title}
              className="blog-image"
            />
            {post.isFeatured && (
              <span className="featured-badge">Featured</span>
            )}
          </div>
        )}

        <div className="blog-content">
          <h3 className="blog-title">{post.title}</h3>
          
          <p className="blog-excerpt">
            {post.excerpt || post.content?.substring(0, 150) + '...'}
          </p>

          <div className="blog-meta">
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
              {post.categories.slice(0, 2).map(cat => (
                <span key={cat._id} className="category-tag">
                  {cat.name}
                </span>
              ))}
              {post.categories.length > 2 && (
                <span className="category-tag more">
                  +{post.categories.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;