import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function MessagePage(){
    const [messages, setMessages] = useState([]);
    const { conversationId } = useParams(); 
    useEffect(() =>{ //We fetch all initial messages here, and we update messages throughout with usequery
        async() =>{
            const fetchData = await fetch(`http://localhost:8080/api/conversations/${conversationId}`);
            const data = await fetchData.json();
            setMessages(data.messages); //Set messages to what was fetched from conversation messages
        }
    }, [])

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["messages"], 
        staleTime: 1000 * 30,
        queryFn: async () =>{
            const fetchLatest = await fetch(`http://localhost:8080/api/latestMessage/${conversationId}`);
            const latestData = await fetchLatest.json();
            return latestData;
        }
    })
}