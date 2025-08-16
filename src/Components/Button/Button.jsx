import React from 'react'
import parse from 'html-react-parser';
const Button = ({innerText,className, link, ctaFunction, icon}) => {
     
  return (
        (link!=null) ?
    <a className={`button ${className}`} href={link}>
      { innerText }
    </a>
    : (ctaFunction ? 
        <button className={`button ${className}`} onClick={ ctaFunction }>
                { (icon) ? parse(icon) : innerText }
        </button>
        : ''
    )
  )
}

export default Button
