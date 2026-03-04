import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogs } from '../../../data/blogData';
import "./Blog.css";

function BlogDetail() {
    const { id } = useParams();
    const blog = blogs.find(b => b.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = "smooth";

        const elements = document.querySelectorAll(".reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: 0.1 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [id]);

    if (!blog) {
        return (
            <div className='blog_container'>
                <div className='blog' style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h1>Blog Not Found</h1>
                    <Link to="/website" className='violet-link'>Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className='blog_container fade-in'>
            <div className='blog'>
                <div className='datetime'>{blog.date} • {blog.readTime}</div>

                <div className='title'>
                    {blog.title}
                </div>

                <div className='description'>
                    {blog.desc}
                </div>

                <div className='blog_content'>
                    <div className='paragraph'>
                        <span className='main_letter'>{blog.content[0]?.text?.charAt(0)}</span>
                        {blog.content[0]?.text?.slice(1)}
                    </div>

                    {blog.content.slice(1).map((item, index) => {
                        if (item.type === 'paragraph') {
                            return <div key={index} className='paragraph'>{item.text}</div>;
                        }
                        if (item.type === 'heading') {
                            const HeadingTag = `h${item.level || 2}`;
                            return <div key={index} className='section reveal'><HeadingTag className={`heading${item.level || 2}`}>{item.text}</HeadingTag></div>;
                        }
                        if (item.type === 'image') {
                            return (
                                <div key={index} className='large_image reveal'>
                                    <img src={item.src} alt={item.alt || ""} />
                                </div>
                            );
                        }
                        if (item.type === 'quote') {
                            return <div key={index} className='quotes reveal'>{item.text}</div>;
                        }
                        if (item.type === 'split-content') {
                            return (
                                <div key={index} className='image_explain reveal'>
                                    <div className='image'>
                                        <img src={item.src} alt={item.alt || ""} />
                                    </div>
                                    <div className='explain'>
                                        {item.text.map((p, pIndex) => (
                                            <div key={pIndex} className='paragraph'>
                                                {p.startsWith('BOLD:') ? (
                                                    <><strong>{p.replace('BOLD:', '').split('|')[0]}</strong><br />{p.split('|')[1]}</>
                                                ) : p}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}

                    <div className='tags reveal'>
                        <ul>
                            {blog.tags ? (
                                blog.tags.map((tag, index) => (
                                    <li key={index}>{tag.toUpperCase()}</li>
                                ))
                            ) : (
                                <li>{blog.tag?.toUpperCase()}</li>
                            )}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default BlogDetail;
