import { useState, useEffect } from "react"
import ProfileDisplay from "../Components/ProfileDisplay"
export default function SearchPage(){
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    useEffect(()=>{
        const handleSearch = async() =>{ 
            //Whenever searchterm changes in dependency array, ths is reran, searching again
            try{
                const fetchedSearchDataJson = await fetch('http://localhost:8080/api/findUser', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userName: searchTerm.toLowerCase()})
                });
                const fetchedSearchData = await fetchedSearchDataJson.json();
                setSearchResults(fetchedSearchData); 
            }catch(err){
                console.error("Error fetching search data", err);
            }
            //Set state to entire fetchedSearchData, so we can pass down value from here instead of doing ANOTHER fetch
        }
        if(searchTerm){
            handleSearch();
        }
    }, [searchTerm])
    const handleForm = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.userSearchInput.value);
    }

    
    return(
        <div className="SearchPage">
            <form id="searchForm" onSubmit={handleForm}>
                <input id="userSearchInput" name="userSearchInput" type="text"></input>
            </form>
            {
                searchResults?.name === "User not found" ? (
                    <h1>User not found</h1>
                ) : (
                    searchResults && (
                     <div className="userReturnedData">
                        <ProfileDisplay user={searchResults} />
                     </div>
                    )
                )
            }
        </div>
    )
}