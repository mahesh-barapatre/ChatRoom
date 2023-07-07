import { useEffect, useRef, useState } from "react";
import { Box , Container , VStack , HStack , Button, Input } from "@chakra-ui/react";
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

const logoutHandler=()=>{
  signOut(auth)
  toast.warning('Logout!', {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    theme: "light",
    });
}

function App() {

  const [user , setUser] = useState(false)
  const [message , setMessage] = useState('')
  const [messages , setMessages] = useState([])

  const divForScroll = useRef(null)

  const submithandler = async(e)=>{ 
    e.preventDefault()
  
    try {
      setMessage('')
      await addDoc(collection(db,"Messages"),{
        text: message,
        uid: user.uid,
        uri: user.photoURL,
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
    const q = query(collection(db,"Messages"),orderBy('createdAt',"asc"))

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
  },[])

  return (
    <Box bg={'white'}>

      <ToastContainer></ToastContainer>

    {
      user ? 
      (
        
            <Container bg={'blue.50'} h={'100vh'} padding={'4'} > 
            <VStack h={'full'}>
              <Button onClick={logoutHandler} colorScheme="green" w={'full'}>Logout</Button>
              <VStack h={'full'} w={'full'} overflowY={'auto'} css={{'&::-webkit-scrollbar':{
                display:'none',
              }}}>
                  {
                    messages.map((item) => {
                      return <Message
                      key={item.id} //related to map method
                      user={item.uid===user.uid ? 'me' : 'other'}
                      msg={item.text}
                      uri={item.uri}
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
            <Button onClick={loginHandler} colorScheme="green">Sign In with Google</Button>
        </VStack>
      )
    }
    </Box>

  )
}

export default App;
