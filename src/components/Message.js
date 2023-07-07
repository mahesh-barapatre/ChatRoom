import React from 'react'
import { Text , HStack , Avatar, VStack } from "@chakra-ui/react";

function Message({msg, user, uri, name }) {
  return (
    <HStack gap={'0.3rem'} borderRadius={'7'} paddingY={'1'} paddingX={'2'} alignSelf={user === "me" ? 'flex-end' : 'flex-start'}>
        {
            user==='other' ? 
            <Avatar
            size={'sm'}
            src={uri}> 
            </Avatar> : null
        }
        <VStack gap={'0'} alignItems={user !== "me" ? 'flex-start' : 'flex-end'} padding={1} borderRadius={7} bg={user === 'me' ? 'green.100':'blue.100'}>
        {
          user==='other' ? 
          <Text fontSize={'xs'} fontWeight={'bold'} color={user === "me" ?'green.500' : 'blue.500'}>{name}</Text>
          : null
        }
        <Text margin={'0'} fontSize={'sm'} marginBlockStart={0} color={'black'}>{msg} </Text>
        </VStack>

        {
            user==='me' ? 
            <Avatar 
            size={'sm'}
            src={uri}
            > </Avatar> : null
        }
    </HStack>
  )
}

export default Message
