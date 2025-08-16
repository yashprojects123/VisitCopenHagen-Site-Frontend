import React from 'react'
import Logo from '../../../Components/Logo/Logo'
import UserAccountDropdown from '../../../Components/UserAccountDropdown/UserAccountDropdown'
import './Header.css'
const Header = () => {
  return (
    <header className='admin-header'>
      <Logo/>
      <UserAccountDropdown/>
    </header>
  )
}

export default Header
