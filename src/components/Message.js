import React from 'react'
import { Text , HStack , Avatar } from "@chakra-ui/react";

function Message({msg, user, uri}) {
  return (
    <HStack borderRadius={'7'} bg={user === 'me' ? 'green.100':'blue.100'} padding={'2'} alignSelf={user === "me" ? 'flex-end' : 'flex-start'}>
        {
            user==='other' ? <Avatar>{uri} </Avatar> : null
        }
        <Text color={'black'}>{msg} </Text>
        {
            user==='me' ? <Avatar>{uri} </Avatar> : null
        }
    </HStack>
  )
}

export default Message
