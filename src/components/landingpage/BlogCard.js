import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BlogCard = React.memo(({ blog, index }) => {
    return (
        <motion.li
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="blog_item"
        >
            <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className='all_imag'>
                    <img src={blog.img} alt='' loading="lazy" />
                </div>
                <div className='tagss'>
                    <div className='tag'>
                        {blog.tags && blog.tags.length > 0
                            ? blog.tags[0]
                            : (blog.tag || "News")}
                    </div>
                    <div className='posted'>DEC 20, 2026</div>
                </div>
                <div className='blogs_heading'>{blog.title}</div>
            </Link>
        </motion.li>
    );
});

export default BlogCard;
