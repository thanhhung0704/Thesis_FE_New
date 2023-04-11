import React from 'react'
import './header.css'
import logo from '../../assets/chatBot.png'
import { Link } from 'react-router-dom';
import 'animate.css';

function Header() {
  return (
    <div className='header-container section-padding' id='header-section'>
        <h1 className='gradient-text'>Introducing to BK ChatBot</h1>
        <h2>Ask real questions. Get complete answers. Chat and create.</h2>
        <Link to="/chat"><button className='btn'>Try now</button></Link>
        <img src={logo} alt="" />
    </div>
  )
}

export default Header