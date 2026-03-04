import React, { useState, useRef, useEffect } from 'react'
import "./LandingPage.css"
import Navbar from './navbar/Navbar'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { motion, AnimatePresence } from 'framer-motion'
import BlogCard from './BlogCard'
import { Link } from 'react-router-dom'
import { blogs, menuItems } from '../../data/blogData'

function LandingPage() {

  const [active, setActive] = useState(0)
  const indicatorRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const [currentBlog, setCurrentBlog] = useState(0)
  const [filteredBlogs, setFilteredBlogs] = useState(blogs)

  useEffect(() => {
    if (active === 0) {
      setFilteredBlogs(blogs)
    } else {
      const selectedTag = menuItems[active]
      setFilteredBlogs(blogs.filter(blog => blog.tags && blog.tags.includes(selectedTag)))
    }
  }, [active])

  useEffect(() => {
    const currentItem = menuRef.current.children[active]
    const indicator = indicatorRef.current

    if (currentItem && indicator) {
      indicator.style.width = currentItem.offsetWidth + "px"
      indicator.style.transform = `translateX(${currentItem.offsetLeft}px)`
    }
  }, [active])

  /* AUTO SLIDER */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlog(prev => (prev + 1) % blogs.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])


  return (
    <div>
      <Navbar />

      <div className="landing_container">

        <div className='main_title'>Blogs</div>

        <div className='menu'>
          <div className='menu_wrapper'>

            <ul ref={menuRef}>
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={active === index ? "active_item" : ""}
                  onClick={() => setActive(index)}
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className='menu_slider' ref={indicatorRef}></div>

          </div>

          <AnimatePresence mode="wait">
            {active === 0 && (
              <motion.div
                key="landing-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className='landingpage_card'
              >

                <div className='landingpage_text'>

                  <div key={currentBlog} className="text_content">

                    <div className='landingpage_title'>
                      {blogs[currentBlog].title}
                    </div>

                    <div className='landingpage_description'>
                      {blogs[currentBlog].desc}
                    </div>

                    <div className='full_artical_container'>
                      <Link to={`/blog/${blogs[currentBlog].id}`} className='full_artical' style={{ textDecoration: 'none', color: 'inherit' }}>

                        <div className='prime_btn'>
                          <i className="bi bi-arrow-right-short"></i>
                        </div>

                        <div className='normal'>
                          Read full article
                        </div>

                      </Link>
                    </div>

                  </div>

                </div>

                <div className='landingpage_image'>

                  <div
                    className="image_slider"
                    style={{
                      transform: `translateX(-${currentBlog * 100}%)`
                    }}
                  >

                    {blogs.map((blog, index) => (
                      <img key={index} src={blog.img} alt='' />
                    ))}

                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className='all_blogs'>
          <div className="masonry_container">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="masonry_column">
                <AnimatePresence mode="popLayout">
                  {filteredBlogs.filter((_, i) => i % 3 === colIndex).map((blog, index) => (
                    <BlogCard key={`${blog.title}-${index}`} blog={blog} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default LandingPage