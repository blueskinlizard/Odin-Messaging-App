/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useQuery} from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import MessageBubble from "../Components/MessageBubble";


export default function MessagePage(){
    const [fetchedMessages, setFetchedMessages] = useState([]);
    const [recipientUser, setRecipientUser] = useState();
    const [localMessages, setLocalMessages] = useState([]); //Local messages state array is to read off when passing to database
    const lastFetchedMessage = useRef(null);
    const navigate = useNavigate();
    //Logic is as follows: Instead of rerendering EVERY MESSAGE, we will useeffect to fetch only ones stored in database,
    //and whatever ones the user will create on the site will initially be saved to localmessages state, which is the only thing being rerendered.
    //LocalMessages will then be saved to the db when user navs off, and will only fetch on init like the other ones
    const [currentUser, setCurrentUser] = useState();
    const { conversationId } = useParams(); //We will be redirected to our conversation after interaction with ProfileDisplayComponent
    useEffect(() =>{ //We fetch all initial messages here, and we update messages throughout with usequery
        console.log("Conversation Id: "+conversationId);
        const fetchInit = async() =>{
            const fetchData = await fetch(`http://localhost:8080/api/conversations/${conversationId}`); 
            const data = await fetchData.json();

            const currentUserJson = await fetch('http://localhost:8080/api/currentUser',{ credentials: "include"}); //I just dont like context idk why
            const currentUserData = await currentUserJson.json();


            setCurrentUser(currentUserData);
            const checkForUserInConversation = data.participants.find(user => user.name === currentUserData.name)
            if(!checkForUserInConversation){
                navigate("/home"); //Redirect users that arent part of conversation
            }
            const recipient = data.participants.find(user => user.name !== currentUserData.name);
            //I don't want to run into async errors with state, so I'll just set recipient to returned JSON data
            setRecipientUser(recipient);
            console.log("Recipient name registered as: "+recipient.name)
            
            setFetchedMessages(data.messages); //Set messages to what was fetched from conversation messages

        }
        fetchInit();
    }, [conversationId, navigate]);

    const saveMessage = async(message) =>{ 
        if (!recipientUser || !message || !message.content) return;
        console.log("Sent message content includes: "+message.content)
        console.log("RecipientUser state sent to stored as: "+recipientUser.name);

        if (!recipientUser || !message || !message.content || !conversationId) {
            console.log("saveMessage was called but missing required data:");
            console.log("recipientUser:", recipientUser);
            console.log("message:", message);
            console.log("conversationId:", conversationId);
            return;
        }
    
        console.log("Sending message to backend:", {
            recipientUser: recipientUser.id,
            conversationId,
            messageContent: message.content
        });
            const createMessage = await fetch('http://localhost:8080/api/createmessage/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ recipientUser: recipientUser, conversationId: conversationId, messageContent: message.content})
            })
    }
    const createLocalMessage = (formEntered) =>{
        try{
            formEntered.preventDefault();
            const form = formEntered.target;
            const content = form.elements.message.value;
            const timeCreated = new Date().toISOString();
            if(!currentUser || !content.trim()){return;}
            const createdMessage = {
                content: content,
                createdAt: timeCreated,
                author: currentUser.name
            }
            form.reset();
            setLocalMessages(prev => [...prev, createdMessage]);
            saveMessage(createdMessage);

        }catch(err){
            console.log("Error in adding data to LocalMessages: "+err)
        }
    }  
    const receiveMessageQuery = useQuery({ //This is for real - time updates for received messages
        queryKey: ["messages", conversationId], 
        staleTime: 1000 * 20,
        queryFn: async () =>{
            if (!currentUser || !conversationId) return null;
            const fetchLatest = await fetch(`http://localhost:8080/api/latestMessage/${conversationId}`);
            const latestData = await fetchLatest.json();
            console.log("Latest data content: "+latestData.content)
            //If latestdata.author is stored by id thats lowk the funniest thing ever
            console.log("Latest data author: "+latestData.author.name+ " current User name: "+currentUser.name)
            if(latestData.author.name != currentUser.name && latestData.content != lastFetchedMessage.current.content){
                //This signifies that this is an unregistered, newly sent message from other side of conversation
                console.log("Query ran!");
                setLocalMessages(prev => [...prev, latestData]); 
                localMessages.map((value, index) =>{
                    console.log("Content:" +value.content+ "at index: "+index);
                    return;
                })
                lastFetchedMessage.current = latestData;
            }
            return latestData;
        },
        enabled: !!currentUser && !!conversationId, //Makes sure prereqs are fulfilled before querying
        refetchInterval: 1000 * 5,
        refetchIntervalInBackground: false
    })
    //Too lazy to implement context, so I just made the messageInputter a part of the page, not a component
    return(
        <div className="MessagePage">
            <h1>Messages with: {recipientUser ? recipientUser.name : "Loading..."}</h1>
            <div className="fetchedMessages">
                {fetchedMessages.map((value, index) =>(
                    <MessageBubble key={value.id} content={value.content} createdAt={value.createdAt} author={currentUser.name} messageAuthor={value.author}/>
                ))}
                {localMessages.map((value, index) => (
                    <MessageBubble key={`localMessage${index}`} content={value.content} createdAt={value.createdAt} author={currentUser.name} messageAuthor={value.author}/>
                ))}
            </div>

            <div className="messageInputWrapper"> 
                <form id="messageInputter" onSubmit={createLocalMessage}>
                    <input id="messageInput" name="message"></input>
                </form>
            </div>
        </div>
    )
}