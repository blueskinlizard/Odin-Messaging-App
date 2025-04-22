import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

const fetchMessages = async() =>{
    
}

export default function MessagePage(){
    const [messages, setMessages] = useState([]);
    useEffect(() =>{
        async() =>{
            const fetchData = await fetch(`http://localhost:8080/api`)
        }
    })

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["messages"], 
        queryFn: fetchMessages
    })
}