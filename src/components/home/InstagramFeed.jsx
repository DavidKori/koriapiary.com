// src/components/home/InstagramFeed.jsx
import React from 'react';
import { FiInstagram, FiHeart, FiMessageCircle } from 'react-icons/fi';

const InstagramFeed = () => {
  const posts = [
    {
      id: 1,
      image: '/images/instagram/1.jpg',
      likes: 234,
      comments: 12,
      caption: 'Fresh harvest day! 🍯'
    },
    {
      id: 2,
      image: '/images/instagram/2.jpg',
      likes: 189,
      comments: 8,
      caption: 'Our bees working hard 🐝'
    },
    {
      id: 3,
      image: '/images/instagram/3.jpg',
      likes: 456,
      comments: 23,
      caption: 'New honey varieties coming soon!'
    },
    {
      id: 4,
      image: '/images/instagram/4.jpg',
      likes: 167,
      comments: 5,
      caption: 'Morning harvest 🌅'
    },
    {
      id: 5,
      image: '/images/instagram/5.jpg',
      likes: 345,
      comments: 15,
      caption: 'Pure golden goodness ✨'
    },
    {
      id: 6,
      image: '/images/instagram/6.jpg',
      likes: 278,
      comments: 9,
      caption: 'Behind the scenes at the apiary'
    }
  ];

  return (
    <section className="instagram-feed">
      <div className="instagram-header">
        <FiInstagram className="instagram-icon" />
        <h2>Follow Us on Instagram</h2>
        <a 
          href="https://instagram.com/apiaryhoney" 
          target="_blank" 
          rel="noopener noreferrer"
          className="instagram-handle"
        >
          @apiaryhoney
        </a>
      </div>

      <div className="instagram-grid">
        {posts.map(post => (
          <div key={post.id} className="instagram-post">
            <img src={post.image} alt={post.caption} />
            <div className="post-overlay">
              <div className="post-stats">
                <span>
                  <FiHeart /> {post.likes}
                </span>
                <span>
                  <FiMessageCircle /> {post.comments}
                </span>
              </div>
              <p className="post-caption">{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;