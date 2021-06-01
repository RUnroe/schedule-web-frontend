let timer;
let showingResults = false;
let friendsList = {};

const backToApp = () => {
    window.location.href = "/app";
}


const updateResultList = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        getResultData();
    }, 1000);
}

const getResultData = () => {
    let searchTerm = document.getElementById("friendSearchInput").value; 
    if(searchTerm) {
        searchTerm = searchTerm.trim();
        searchTerm = searchTerm.replaceAll(" ", "+");

        fetch(`${apiUrl}${apiVersion}/friends/search?q=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            populateResultsList(data);
            document.getElementById("pageTitle").innerHTML = `Results(${data.length})`;
            if(!showingResults) toggleFriendsList(data.length); 
        });
    }
    else {
        if(showingResults) toggleFriendsList(0); 
    }
}

const toggleFriendsList = resultCount => {
    if(showingResults) {
        showingResults = false;
        document.getElementById("pageTitle").innerHTML = "Current Friends List";
        document.getElementById("searchResultsList").style.display = "none";
        document.getElementById("currentFriendsList").style.display = "";

    }
    else {
        showingResults = true;
        document.getElementById("pageTitle").innerHTML = `Results(${resultCount})`;
        document.getElementById("searchResultsList").style.display = "";
        document.getElementById("currentFriendsList").style.display = "none";
    }
}



const getCurrentFriendsList = () => {
    fetch(`${apiUrl}${apiVersion}/friends`)
    .then((response) => response.json())
    .then((data) => {
        const newData = {current: objToList(data.current), pending: objToList(data.pending)}
        console.log(data, newData);
        
        friendsList = newData;
        populateCurrentFriendsList(newData);
    });
}

const objToList = (object) => {
    let list = [];
    Object.keys(object).forEach(dataKey => {
        let obj = {id: dataKey};
        list.push(Object.assign(obj, object[dataKey]));
    });
    return list;
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
    let container = document.createElement("div");
    container.classList.add("friend-item");

    // let imageContainer = document.createElement("div");
    // imageContainer.classList.add("img-circle");

    // let image = document.createElement("img");
    // image.classList.add("img");
    // image.src = friend.icon;
    // imageContainer.appendChild(image);

    let name = document.createElement("p");
    name.innerHTML = friend.name;

    let btnArea = document.createElement("div");
    btnArea.classList.add("btn-area");


    if(type == "pending") {
        let acceptBtn = document.createElement("div");
        acceptBtn.classList.add("accept");
        acceptBtn.innerHTML = "&#10004;";
        acceptBtn.addEventListener("click", () => {acceptFriendRequest(friend.id)});
        btnArea.appendChild(acceptBtn);

        let declineBtn = document.createElement("div");
        declineBtn.classList.add("delete");
        declineBtn.innerHTML = "&#10006;";
        declineBtn.addEventListener("click", () => {declineFriendRequest(friend.id)});
        btnArea.appendChild(declineBtn);
    }
    else if(type == "current") {
        let removeBtn = document.createElement("div");
        removeBtn.classList.add("delete");
        removeBtn.innerHTML = "&#10006;";
        removeBtn.addEventListener("click", () => {removeFriend(friend.id)});
        btnArea.appendChild(removeBtn);
    }
    else {
        if(!friend.pending) {
        let addBtn = document.createElement("div");
        addBtn.classList.add("accept");
        addBtn.innerHTML = "&plus;";
        addBtn.addEventListener("click", () => {addFriend(friend.user_id)});
        btnArea.appendChild(addBtn);
        }
    }

    // container.appendChild(imageContainer);
    container.appendChild(name);
    container.appendChild(btnArea);
    return container;
}

const showMessage = message => {
    document.getElementById("messageText").innerHTML = message;
    document.getElementById("messageContainer").classList.add("show");
    setTimeout(() => {
        document.getElementById("messageContainer").classList.remove("show");
    }, 1500);
}



//PENDING
const acceptFriendRequest = (friendshipId) => {
    //fetch request to accept request. Do not know what info to send yet
    fetch(`${apiUrl}${apiVersion}/friends/${friendshipId}`, {method: 'PUT'})
    .then(response => {
        if(response.status == 204) {
            //Remove from pending list
            //Add to current list
            getCurrentFriendsList();
        }

  });
}
//PENDING
const declineFriendRequest = (friendshipId) => {
    //fetch request to decline request. Do not know what info to send yet
    fetch(`${apiUrl}${apiVersion}/friends/${friendshipId}`, {method: 'DELETE'})
    .then(response => {
        if(response.status == 204) {
            //Remove from pending list
            getCurrentFriendsList();
        }

  });
    
}
//SEARCH
const addFriend = (friendId) => {
    //fetch request to add friend. Do not know what info to send yet
    fetch(`${apiUrl}${apiVersion}/friends/${friendId}`, {method: 'POST'})
    .then(response => {
        if(response.status == 202) {
            showMessage("Friend request sent");
            //Remove add option from friend item html
            getResultData();
        }

  });
}
//CURRENT
const removeFriend = (friendshipId) => {
    //fetch request to remove friend. Do not know what info to send yet
    fetch(`${apiUrl}${apiVersion}/friends/${friendshipId}`, {method: 'DELETE'})
    .then(response => {
        if(response.status == 204) {
            showMessage("Friend has been removed");
            //Remove from current friends list
            getCurrentFriendsList();
        }

  });
}

document.getElementsByClassName("back-arrow")[0].addEventListener("click", () => {backToApp();});

document.getElementById("friendSearchInput").addEventListener("input", () => {updateResultList()});
getCurrentFriendsList();
