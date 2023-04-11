import React from 'react'
import {HiOutlineMenuAlt4} from 'react-icons/hi'
import {AiOutlineClose} from 'react-icons/ai'
import './navbar.css'
import { useState } from 'react'
import { Link } from 'react-scroll'

function NavBar() {
    const[click,setClick] = useState(false)
    // const[activeLink, setActiveLink] = useState('')
    const handleClick = () => setClick(!click)


    // const onUpdateActiveLink = (value) => {
    //     setActiveLink(value);
    //   }



return (
    <div className='navbar'>
        <div className='container'>
            <div className="hamburger" onClick={handleClick}>
                    {click ? (<AiOutlineClose className = 'icon' />) :(<HiOutlineMenuAlt4 className='icon' />)}
                    
            </div>
            <a href="/" className='logo'>
                <img src="https://e-learning.hcmut.edu.vn/pluginfile.php/1/core_admin/logocompact/300x300/1664529688/logoBK.png" alt="Logo here"/>
            </a>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                <li><Link activeClass="active" to="header-section" spy={true} smooth={true} offset={-150} duration={100}>Giới thiệu</Link></li>
                <li><Link activeClass="active" to="feature-section" spy={true} smooth={true} offset={-100} duration={100} >Tính năng</Link></li>
                <li><Link activeClass="active" to="example-section" spy={true} smooth={true} offset={-100} duration={100}>Câu hỏi mẫu</Link></li>
            </ul>
            <button className='btn'>Đăng Nhập</button>
            
        </div>
    </div>
  )
}

export default NavBar