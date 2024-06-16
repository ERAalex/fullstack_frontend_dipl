import {useState, useEffect} from 'react'
import request from 'axios'

export default function ListNotes() {
    const [list, setList] = useState([])

    const getData = () => {
        const {data} = request.get('http://localhost:7070/notes')
        setList(data)
    }

    console.log('--1---')
    console.log(list)
    console.log('--2---')

    return (
        <div>
            <h1>List Notes</h1>
            <button onClick={getData}>Get Data</button>
            <ul>
                {list && list.length > 0 ? (
                  list.map((item, index) => <li key={index}>{item}</li>)
                ) : (
                  <li>No notes available</li> // Code to be executed when list is empty
                )}
            </ul>
        </div>
    )
}
