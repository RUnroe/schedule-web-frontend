let timer;
let showingResults = false;

const updateResultList = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        const searchTerm = document.getElementById("friendSearchInput").value; 
        if(searchTerm) {
            searchTerm = searchTerm.trim();
            searchTerm = searchTerm.replaceAll(" ", "+");

            fetch(`${apiUrl}/api/${apiVersion}/friends/search?q=${searchTerm}`)
            .then((response) => response.json())
            .then((data) => {
                populateResultsList(data);
                if(!showingResults) toggleFriendsList(data.length); 
            });
        }
        else {
            if(showingResults) toggleFriendsList(0); 
        }
    }, 1000);
}

const toggleFriendsList = resultCount => {
    if(showingResults) {
        document.getElementById("pageTitle").innerHTML = "Current Friends List";
        document.getElementById("searchResultsList").style.display = "none";
        document.getElementById("currentFriendsList").style.display = "";

    }
    else {
        document.getElementById("pageTitle").innerHTML = `Results(${resultCount})`;
        document.getElementById("searchResultsList").style.display = "";
        document.getElementById("currentFriendsList").style.display = "none";
    }
}



const getCurrentFriendsList = () => {
    fetch(`${apiUrl}/api/${apiVersion}/friends`)
    .then((response) => response.json())
    .then((data) => {
        populateCurrentFriendsList(data);
    });
}

const populateCurrentFriendsList = data => {
    data.pending.forEach(friend => {
        document.getElementById("pendingFriends").appendChild(generateFriendItem(friend, "pending"));
    });

    data.current.forEach(friend => {
        document.getElementById("allFriends").appendChild(generateFriendItem(friend, "current"));
    });
}


const populateResultsList = data => {
    document.getElementById("searchResultsList").innerHTML = "";
    data.forEach(friend => {
        document.getElementById("searchResultsList").appendChild(generateFriendItem(friend, "search"));
    });
}


const generateFriendItem = (friend, type) => {
    
}



document.getElementById("friendSearchInput").addEventListener("input", () => {updateResultList()});
getCurrentFriendsList();
