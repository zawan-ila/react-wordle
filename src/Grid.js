import React from 'react'

import './Grid.css'

export default function Grid({gridContent, onAnimationEnd, gridComponentClasses}) {
  return (
    <div className="grid-container">
        {Array(30).fill(0).map((elem, idx) => {
            let classesOnDiv = gridComponentClasses[idx+1]?gridComponentClasses[idx+1].join(" "):""
            return <div key={idx+1} className={classesOnDiv} onAnimationEnd={() => onAnimationEnd(idx+1)}>
                    {gridContent[idx+1]}
                   </div>
        })}
    </div>
  )
}
