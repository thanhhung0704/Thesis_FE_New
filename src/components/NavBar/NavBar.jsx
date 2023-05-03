import React from 'react'
import {HiOutlineMenuAlt4} from 'react-icons/hi'
import {AiOutlineClose} from 'react-icons/ai'
import './navbar.css'
import logo from '../../assets/logoBK.png'
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
                <img src={logo} alt="Logo here"/>
            </a>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                <li><Link activeClass="active" to="header-section" spy={true} smooth={true} offset={-100} duration={100}>GIỚI THIỆU</Link></li>
                <li><Link activeClass="active" to="feature-section" spy={true} smooth={true} offset={-80} duration={100} >TÍNH NĂNG</Link></li>
                <li><Link activeClass="active" to="example-section" spy={true} smooth={true} offset={-70} duration={100}>CÂU HỎI MẪU</Link></li>
            </ul>
            <button className='btn'>Đăng Nhập</button>
            
        </div>
    </div>
  )
}

export default NavBar