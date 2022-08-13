import React from 'react'
import NavBar from '../../components/NavBar/NavBar'

function About({logout}) {
  return (
    <div>
      <NavBar logout = {logout} />
      <h1>About</h1>
    </div>
  )
}

export default About
