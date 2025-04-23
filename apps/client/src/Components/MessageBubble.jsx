import { useState } from "react"
export default function MessageBubble(props){
    const [content] = useState(props.content)
    const [author] = useState(props.author);
    const [messageAuthor] = useState(props.messageAuthor);
    const [dateCreated] = useState(props.dateCreated);
    return(
        //Conditional for css, changing whether text bubble is colored or not(based on ID)
        //Also check if person who wrote message(messageAuthor) is equal to global author
        <div className={messageAuthor === author ? "userMessage" : "recipientMessage"}> 
            <div className="messageContent">
                <h3>{content}</h3>
                <div className="messageDate">{dateCreated}</div>
            </div>
        </div>
    )
}