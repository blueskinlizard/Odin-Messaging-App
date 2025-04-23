/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function MessagePage(){
    const [fetchedMessages, setFetchedMessages] = useState([]);
    const [recipientUser, setRecipientUser] = useState();
    const [localMessages, setLocalMessages] = useState([]);
    //Logic is as follows: Instead of rerendering EVERY MESSAGE, we will useeffect to fetch only ones stored in database,
    //and whatever ones the user will create on the site will initially be saved to localmessages state, which is the only thing being rerendered.
    //LocalMessages will then be saved to the db when user navs off, and will only fetch on init like the other ones
    const [currentUser, setCurrentUser] = useState();
    const { conversationId } = useParams(); //We will be redirected to our conversation after interaction with ProfileDisplayComponent
    useEffect(() =>{ //We fetch all initial messages here, and we update messages throughout with usequery
        const fetchInit = async() =>{
            const fetchData = await fetch(`http://localhost:8080/api/conversations/${conversationId}`); 
            const data = await fetchData.json();

            const currentUserJson = await fetch('http://localhost:8080/api/currentUser'); //I just dont like context idk why
            const currentUserData = await currentUserJson.json();
            setCurrentUser(currentUserData);

            const recipient = (currentUser) =>{
                const recipient = data.participants.find(user => user.name !== currentUser);
                setRecipientUser(recipient);
            }
            setFetchedMessages(data.messages); //Set messages to what was fetched from conversation messages
        }
        fetchInit();
        return() =>{
            async() =>{ //ONLY RUN ON UNMOUNT, ADDING LOCALMESSAGES TO DB
                if (!recipientUser || !localMessages.length) return;
                for(let msg in localMessages){
                    const createMessage = await fetch('http://localhost:8080/api/createmessage/', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ recipientUser: recipientUser, conversationId: conversationId, messageContent: msg.content})
                    })
                }
                
            }
        }
    }, [conversationId, recipientUser])
    const createLocalMessage = (content) =>{
        const createdMessage = {
            content: content,
            createdAt: new Date().toISOString(),
        }
        setLocalMessages(prev => [...prev, createdMessage]);
    }
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["messages", conversationId], 
        staleTime: 1000 * 5,
        queryFn: async () =>{
            const fetchLatest = await fetch(`http://localhost:8080/api/latestMessage/${conversationId}`);
            const latestData = await fetchLatest.json();
            return latestData;
        }
    })
    return(
        <div className="MessagePage">
            <h1>Messages with: {recipientUser}</h1>
            
        </div>
    )
}