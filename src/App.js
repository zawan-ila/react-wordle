import React, {useRef, useEffect, useState} from 'react'
import Grid from './Grid'
export default function App() {

  const [wordList, setwordList] = useState([
    "STATE",
    "CRANE",
    "DEALT",
    "FRAME",
    "DRAIN",
    "CRAMP"
  ])

  const [word, setWord] = useState("")
  const [gridContent, setGridContent] = useState({})
  const [currIdx, setCurrIdx] = useState(0)
  const [allowedJump, setAllowedJump] = useState(false)
  const [gridComponentClasses, setGridComponentClasses] = useState({})
  const [display, setDisplay] = useState('')
  const [rowsDone, setRowsDone] = useState([])
  const end = useRef(false)

  useEffect(() => {
    setWord(wordList[Math.floor(Math.random()*wordList.length)])
  }, [])


  function handleLetterPress(letter){

    if (currIdx % 5 == 0 && currIdx != 0){

      if (allowedJump){
        setAllowedJump(c => false)
      }
      else{
        return
      }

    }


    setGridContent(prevGridContent => {
      let newContent = {...prevGridContent}
      newContent[currIdx+1] =  letter
      return newContent
    })

    setCurrIdx(currIdx => currIdx + 1)


  }


  function getBackgroundClass(letter, idx, word){
    if (word[idx] == letter){
      return 'green-bg'
    }
    else if(word.includes(letter)){
      return 'yellow-bg'
    }
    else{
      return 'gray-bg'
    }

  }

  function onAnimationEnd(key){
    document.addEventListener('keyup', handleKeyUp)
    setGridComponentClasses(oldClasses => {
      let gridClasses = {...oldClasses}
      if (gridClasses[key].length == 1)
        gridClasses[key] = []
      else
        gridClasses[key] = gridClasses[key].slice(0,2)
      return gridClasses
    })
  }

  function setGridClasses(key, idx, word, classList, timeout=0){
    setTimeout(function(){
      document.removeEventListener('keyup', handleKeyUp)

      setGridComponentClasses(oldClasses => {
        let gridClasses = {...oldClasses}
        gridClasses[key] = classList
        return gridClasses
      })
    }, timeout);
  }

  function handleEnter(){
    if (currIdx == 0 || rowsDone.includes(currIdx))
      return
  
    if (currIdx % 5 == 0){

      let keys = [currIdx-4, currIdx-3, currIdx-2, currIdx-1, currIdx]

      keys.forEach((key, idx) => {
        
        let classList = ['font-white', getBackgroundClass(gridContent[key],idx,word), 'flip']
        setGridClasses(key, idx, word, classList, 250*idx)
  
      })


      setTimeout(() => {
        document.removeEventListener('keyup', handleKeyUp)
        setAllowedJump(true)

      
        let guess = keys.map(v => gridContent[v]).join("")
  
        if  (guess === word){
          keys.forEach((key, idx) => {
    
            let classList = ['font-white', getBackgroundClass(gridContent[key],idx,word), 'updown']
            setGridClasses(key, idx, word, classList, 250*idx)
      
          })
    
          setDisplay('You Won')

          return
        }
  
        if (currIdx == 30){
          setDisplay(`You Lost. The correct word was ${word}`)
          return
        }
  
  
  
  
  
        // setAllowedJump(true)
      }, 250* 6)


      setRowsDone(prev => [...prev, currIdx])
    }

    else{
      let tmpIdx = currIdx
      const keys = []
      while (tmpIdx % 5 !== 0){
        keys.push(tmpIdx)
        tmpIdx --
      }
      
      document.removeEventListener('keyup', handleKeyUp)

      keys.forEach((key, idx) => {
  
        let classList = ['shake']
        setGridComponentClasses(old => {
          let oldClasses = {...old}
          oldClasses[key] = classList
          return oldClasses
        })
  
      })

      document.addEventListener('keyup', handleKeyUp)

    }




  }

  function handleBackSpace(){


    if (currIdx == 0)
      return

    if (currIdx % 5 == 0 && allowedJump)
      return


    setGridContent(prevGridContent => {
      let newContent = {...prevGridContent}
      delete newContent[currIdx]
      return newContent
    })

    if ((currIdx - 1) % 5 == 0){
      setAllowedJump(a => true)
    }

    setCurrIdx(currIdx => {
      return currIdx - 1
    })



    }





  const handleKeyUp = (e) => {
    if (end.current)
      return

    if (e.key.length == 1){
      if (e.key.match(/[a-z]/i)){
        let letterPressed = e.key.toUpperCase()
        handleLetterPress(letterPressed)
      }
    }

    else if(e.key == "Enter"){
      handleEnter()
    }

    else if(e.key == "Backspace"){
      handleBackSpace()
    }

  }
 
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  })

  if (display)
    end.current = true

  return (
    <>
    <div className='heading'>{display}</div>
    <Grid gridContent={gridContent} onAnimationEnd={onAnimationEnd} gridComponentClasses={gridComponentClasses}/>
    </>
  )

  }
