//When a user is searched up, or mentioned, this component will give a little display of their profile

import { useState, useEffect } from "react";

export default function ProfileDisplay(props){
    const [user] = useState(props.user);
    //Purpose of this useffect is to fetch the conversation ID and profile url, so user can enter convo via button or view profile
    useEffect(() =>{ 
        
    }, [user])
}