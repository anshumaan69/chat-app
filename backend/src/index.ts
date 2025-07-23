
//---------------------------------------------------THIS CODE IS FOR BROADCASTING ON ALL DEVICES AND THERE IS NO CONCEPT OF ROOM ----------------------------------------

// import { WebSocketServer,WebSocket } from "ws";
// const ws = new WebSocketServer({port:8080});
// let userCount = 0;
// let allSocket:WebSocket[] =[];
// ws.on("connection",(socket)=>{
//     allSocket.push(socket);
//     userCount++;
//     console.log("User Logged in now user count is : "+ userCount);
//     socket.on("message",(message)=>{
//         console.log("Message recieved : "+ message.toString())
//         for(let i =0;i<allSocket.length ;i++){
//             const s= allSocket[i]
//             s.send(message.toString()+"Sent from server")
//         }
//     })
//     socket.on("disconnect",()=>{
//         allSocket=allSocket.filter(x=>x!=socket);
//     })
// })


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Web sockets dont allow json they only strings to be transferred 




//------------------------------------------------------THIS CODE LETS US CREATE ROOMS IN OUR WEBSOCKET SERVER -------------------------------------------------------------

/*What kind of messages should i be able to send the server 

//WHAT THE USER CAN SEND




//1. Join a room

{
    "type":"join",
    "payload":{
        "roomID":"1234"
    }
} 
//2. Send a message:

{"type":"chat",
"payload":{
"message":"Hi there"}}*/



//WHAT the SERVER can send / user recieves 




import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({port:8080})

interface User {
    socket : WebSocket;
    room:string
}

let allSocket:User[]=[]

wss.on("connection",(socket)=>{
    console.log("A new user Connected")
    socket.on("message",(message)=>{
        const parsedMessage = JSON.parse(message.toString())
        if(parsedMessage.type === "join"){
            allSocket.push({
                socket,
                room:parsedMessage.payload.roomID
            })
        }
        if(parsedMessage.type === "chat"){
            const currentUserRoom = allSocket.find((x)=>x.socket==socket)
            for(let i =0;i<allSocket.length;i++){
                if(allSocket[i].room === currentUserRoom?.room){
                    allSocket[i].socket.send(parsedMessage.payload.message)
                }
            }

        }
        socket.on("close", () => {
            allSocket = allSocket.filter(x => x.socket !== socket);
        });

    })
})

