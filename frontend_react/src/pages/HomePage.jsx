import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {

  let { api_link, authTokens, logoutUser } = useContext(AuthContext)
  let [notes, setNotes] = useState([])
  
  useEffect(()=>{
    getNotes()
  }, [])

  let getNotes = async() => {
    let response = await fetch(api_link+"base/get_notes/", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+String(authTokens.access),
      }
    })
    if(response.status === 200) {
      let data = await response.json()
      setNotes(data)
    } else {
      alert("Something went wrong: ", response.error)
      logoutUser()
    }
  }

  return (
    <div>
      <h1>This is Home Page</h1>
      
      <ul>
        {
          notes.map(note=>(
            <li key={note.id}>{note.body}</li>
          ))
        }
      </ul>

    </div>
  )
}

export default HomePage
