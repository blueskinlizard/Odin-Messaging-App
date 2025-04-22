import { useState } from "react"
import ProfileDisplay from "../Components/ProfileDisplay"
export default function SearchPage(){
    const [searchTerm, setSearchTerm] = useState();
    const [searchResults, setSearchResults] = useState(null);
    const handleForm = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.userSearchInput.value);

    }
    const handleSearch = async() =>{
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
        }catch{
            console.error("Error fetching search data");
        }
        //Set state to entire fetchedSearchData, so we can pass down value from here instead of doing ANOTHER fetch
    }
    handleSearch();
    return(
        <div className="SearchPage">
            <form id="searchForm" onSubmit={() =>{handleForm}}>
                <input id="userSearchInput"></input>
            </form>
            {
                searchResults.name === "User not found" ? (
                    <h1>User not found</h1>
                ) : (
                    <div className="userReturnedData">
                        <ProfileDisplay user={searchResults} />
                    </div>
                )
            }
        </div>
    )
}