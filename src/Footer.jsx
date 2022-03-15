import React from 'react'

  const today = new Date();

const Footer = () => {
  return (
    <footer className='Footer'>
      <p>Copyrighted &copy; by Dracula - {today.getFullYear()}.</p>
    </footer>
  )
}

export default Footer