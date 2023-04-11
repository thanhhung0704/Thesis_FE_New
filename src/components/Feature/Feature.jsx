import React from 'react'
import './feature.css'
import {HiOutlineDesktopComputer, HiOutlineMicrophone, HiOutlineChat} from 'react-icons/hi'
// import {BsChatText} from 'react-icons/bs'
// import {CiMicrophoneOn} from 'react-icons/ci'

function Feature() {
  return (
    <div className="feature-container section-padding" id='feature-section' >
      <svg width="0" height="0">
        <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop stopColor="#1488d8" offset="0%" />
          <stop stopColor="#030391" offset="100%" />
        </linearGradient>
      </svg>
      <div className="text-wrapper">
        <h1 className='gradient-text'>Features</h1>
        <h2>The new Bing offers you reliable, up-to-date results and complete answers to your questions. Of course, it also cites the sources.</h2>
      </div>
      <div className="feature-wrapper">
        <div className="feature-item">
          <h3 className='feature-icon'><HiOutlineDesktopComputer style={{ stroke: "url(#blue-gradient)" }} /></h3>
          <div className="feature-item-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, veniam earum itaque iusto, natus, aliquid illo quas repellendus?</div>
        </div>
        <div className="feature-item">
          <h3 className='feature-icon'><HiOutlineChat style={{ stroke: "url(#blue-gradient)" }}/></h3>
          <div className="feature-item-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga ipsam officia molestiae. Reprehenderit amet sed saepe esse recusandae?</div>
        </div>
        <div className="feature-item">
          <h3 className='feature-icon'><HiOutlineMicrophone style={{ stroke: "url(#blue-gradient)" }}/></h3>
          <div className="feature-item-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum nostrum fugiat tempore a, dolor architecto recusandae iste excepturi autem, laboriosam labore?</div>
        </div>
      </div>
    </div>
  )
}

export default Feature