//When a user is searched up, or mentioned, this component will give a little display of their profile
import { useState, useEffect } from "react";

export default function ProfileDisplay(props){
    const [userProfile] = useState(props.user);
    const [hasConversation, setHasConversation] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    //Purpose of this useffect is to fetch the conversation ID and profile url, so user can enter convo via button or view profile
    //We fetch this by using our query to find a conversation that links to both names, sender and receiver
    useEffect(() =>{ 
        const fetchConversationProps = async() =>{
            try{
                const fetchedConversation = await fetch('http://localhost:8080/api/conversations/', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ receiver: userProfile.toLowerCase()})
                    //Weird naming, but it is referenced as receiver in backend, userprofile refers to parts of our current component
                })
                if(fetchConversationProps.status === 404){
                    setHasConversation(false);
                }
                const data = fetchedConversation.json();
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
    }, [userProfile])
    return(
        <div className="Mini profile display">

        </div>
    )
}