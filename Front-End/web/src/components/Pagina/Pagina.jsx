import React from 'react'

import './Pagina.scss'

function Pagina({postsPerPage, totalPosts, paginate, currentPage}) {

  const pageNumbers = []
  
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className="page-item page">
            <span onClick={() => paginate(number)} className={`btn btn-outline-primary ${(currentPage === number) ? "active" : ""} `}>
              {number}
            </span>
          </li>
        ))}
      </ul>
    </nav>
    
  )
}

export default Pagina