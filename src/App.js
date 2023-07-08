import { useEffect, useRef, useState } from "react";
import { Box , Container , VStack , HStack , Button, Input, Text } from "@chakra-ui/react";
import Message from "./components/Message";
import {onAuthStateChanged , getAuth , GoogleAuthProvider , signInWithPopup , signOut } from "firebase/auth"
import {getFirestore , addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore"
import { app } from "./components/firebase";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler=async()=>{
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider)
  toast.success('Login Successful', {
    position: "top-center",
    autoClose: 500,
    hideProgressBar: true,
    theme: "light",
    });
  
}


function App() {
  
  const [user , setUser] = useState(false)
  const [message , setMessage] = useState('')
  const [room , setRoom] = useState('OpenRoom')
  const [temp , setTemp] = useState('OpenRoom')
  const [messages , setMessages] = useState([])
  
  const logoutHandler=()=>{
    setTemp('OpenRoom')
    signOut(auth)
    toast.warning('Logout!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      theme: "light",
      });
  }

  const divForScroll = useRef(null)

  const submithandler = async(e)=>{ 
    e.preventDefault()
    // console.log(user.displayName)
  
    try {
      setMessage('')
      await addDoc(collection(db,`${room}`),{
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        name: user.displayName,
        createdAt: serverTimestamp(),

      })

      toast.success('sent', {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        theme: "light",
        });
      divForScroll.current.scrollIntoView({behavior: "smooth"})
      
    } catch (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  
  }

  useEffect(()=>{
    const q = query(collection(db,`${room}`),orderBy('createdAt',"asc"))

    //concept of react life-cycle
    const unsubscribe = onAuthStateChanged(auth,(data)=>{ 
      // console.log(data)   
      setUser(data)
    })

    const unsubscribeForMessage= onSnapshot(q,(snap)=>{

      setMessages(
        snap.docs.map((item)=>{
          const id = item.id
          return {id, ...item.data()}
        })
      )
    })  

    return ()=>{
      unsubscribe()
      unsubscribeForMessage()   
    }  
  },[room])

  return (
    <Box bg={'blue.50'}>

      <ToastContainer></ToastContainer>

    {
      user ? 
      (
        
            <Container bgSize={'100% 100%'} bgImage={'https://mcdn.wallpapersafari.com/medium/76/18/I9kqSW.jpg'} h={'100vh'} padding={'2'} > 
            <VStack h={'full'}>

              <HStack bgColor={'rgb(0, 0, 0, .5)'} w={'full'} justifyContent={"space-between"}>
              <Button onClick={logoutHandler} colorScheme="green" >Logout</Button>
              <Text color={'whiteAlpha.900'} fontWeight={'bold'} fontSize={'large'} textAlign={'center'} w={'full'}>{room}</Text>
              </HStack>

              <VStack gap={'0'} h={'full'} w={'full'} overflowY={'auto'} css={{'&::-webkit-scrollbar':{
                display:'none',
              }}}>
                  {
                    messages.map((item) => {
                      return <Message
                      key={item.id} //related to map method
                      user={item.uid===user.uid ? 'me' : 'other'}
                      msg={item.text}
                      uri={item.uri}
                      name={item.name}
                      />
                    })
                  }
                  <div ref={divForScroll}></div>
              </VStack>

              <form onSubmit={submithandler} style={{width:'100%'}} >
              <HStack >
                <Input
                  value={message}
                  onChange={(e)=>setMessage(e.target.value)} 
                  placeholder="Enter a Message..." colorScheme="blue" bg={'blue.100'}></Input>
                <Button type="submit" colorScheme="green">Send</Button>
              </HStack>
      
              </form>
      
            </VStack>
            </Container>
      
      ) : (
        <VStack h={'100vh'} justifyContent={'center'}>

            <Text fontSize={'large'}>JOIN OR CREATE ROOM:</Text>
            <Input w={'60vh'} placeholder="Enter Room name..." bgColor={'blue.100'} onChange={(e)=>setTemp(e.target.value)}></Input>
            <Button onClick={
              ()=>{setRoom(temp)
                    loginHandler()
                  }
            } colorScheme="green">Sign In with Google</Button>
        </VStack>
  
      )
    }
    </Box>

  )
}

export default App;
