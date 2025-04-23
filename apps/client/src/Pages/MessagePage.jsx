/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function MessagePage(){
    const [messages, setMessages] = useState([]);
    const [recipientUser, setRecipientUser] = useState();
    const [currentUser, setCurrentUser] = useState();
    const { conversationId } = useParams(); 
    useEffect(() =>{ //We fetch all initial messages here, and we update messages throughout with usequery
        const fetchInit = async() =>{
            const fetchData = await fetch(`http://localhost:8080/api/conversations/${conversationId}`); //Because the conversationId is included, we reference the second path, using conversationID
            const data = await fetchData.json();

            const currentUserJson = await fetch('http://localhost:8080/api/currentUser'); //I just dont like context idk why
            const currentUserData = await currentUserJson.json();
            setCurrentUser(currentUserData);

            const recipient = (currentUser) =>{
                const recipient = data.participants.find(user => user.name !== currentUser);
                setRecipientUser(recipient);
            }
            setMessages(data.messages); //Set messages to what was fetched from conversation messages
        }
        fetchInit();
    }, [conversationId, recipientUser])
    const createMessage = async() =>{

    }

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["messages", conversationId], 
        staleTime: 1000 * 15,
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