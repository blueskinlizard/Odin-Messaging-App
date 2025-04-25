//When a user is searched up, or mentioned, this component will give a little display of their profile
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function ProfileDisplay(props){
    const [userName] = useState(props.user);
    const [hasConversation, setHasConversation] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const navigate = useNavigate();
    //Purpose of this useffect is to fetch the conversation ID and profile url, so user can enter convo via button or view profile
    //We fetch this by using our query to find a conversation that links to both names, sender and receiver
    useEffect(() =>{ 
        const fetchConversationProps = async() =>{
            try{
                const fetchedConversation = await fetchConversationByName(userName);
                if(fetchedConversation.status === 404){
                    setHasConversation(false);
                    return;
                }
                const data = await fetchedConversation.json();
                //This is to create a button that is able to link to the users conversation from the profile
                setConversationId(data.id);
                setHasConversation(true);
            // eslint-disable-next-line no-unused-vars
            }catch(err){
                console.log("Error occurred in fetching conversation: ")
                setHasConversation(false);
            }
        }
        fetchConversationProps();
    }, [userName])
    const fetchConversationByName = async(receiver) =>{
        return await fetch('http://localhost:8080/api/conversations/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ receiver: receiver.toLowerCase()})
            //Weird naming, but it is referenced as receiver in backend, userprofile refers to parts of our current component
        })
    }

    const createConversationId = async() =>{
        try{
            const response = await fetch('http://localhost:8080/api/createConversation/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ participant: userName.toLowerCase()})
            })
            const data = await response.json();
            setConversationId(data.id);
            navigate(`/messages/${conversationId}`)
        }catch(err){
            console.log("Conversation not created/found, error: "+err);
        }
    }
    return(
        
        <div className="Mini profile display">
            <h1>{userName}</h1>
            <div className="conversationButton">
            {
                hasConversation === false ? (
                    <button onClick={createConversationId}>Start Conversation</button>
                ) : (
                    <Link to={`/messages/${conversationId}`}>Continue chatting</Link>
                )
            }
            </div>
        </div>
    )
}