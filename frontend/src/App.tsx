
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["Hi there","Hello"])
  const wsRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080") // Use 'ws://' not 'http://'

    ws.onmessage = (e) => {
      setMessages(m => [...m, e.data])
    }
    wsRef.current=ws
    ws.onopen=()=>{
      ws.send(JSON.stringify({
        type:"join" ,
        payload:{
          roomID:"red"
        }
      }))

    }

    return () => ws.close()
  }, [])

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col text-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="max-w-xs md:max-w-md bg-white text-gray-800 rounded-lg shadow-md px-4 py-2 self-start"
          >
            {message}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-inner">
        <input
          id="message"
          className="flex-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          type="text"
          placeholder="Type your message..."
        />
        <button onClick={()=>{
          const message = document.getElementById("message")?.value
          wsRef.current.send(JSON.stringify({
            type:"chat",
            payload:{
              message:message
            }
          }))

        }} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow transition">
          SEND
        </button>
      </div>
    </div>
  )
}

export default App
