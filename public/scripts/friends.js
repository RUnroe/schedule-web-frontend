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
    let container = document.createElement("div");
    container.classList.add("friend-item");

    let imageContainer = document.createElement("div");
    imageContainer.classList.add("img-circle");

    let image = document.createElement("img");
    image.classList.add("img");
    image.id  = "profileImg";
    image.src = friend.icon;
    imageContainer.appendChild(image);

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
        let addBtn = document.createElement("div");
        addBtn.classList.add("accept");
        addBtn.innerHTML = "+";
        addBtn.addEventListener("click", () => {addFriend(friend.id)});
        btnArea.appendChild(addBtn);
    }

    container.appendChild(imageContainer);
    container.appendChild(name);
    container.appendChild(btnArea);
    return container;
}


const acceptFriendRequest = () => {
    //fetch request to accept request. Do not know what info to send yet
}

const declineFriendRequest = () => {
    //fetch request to decline request. Do not know what info to send yet
}

const addFriend = () => {
    //fetch request to add friend. Do not know what info to send yet
}
const removeFriend = () => {
    //fetch request to remove friend. Do not know what info to send yet
}


document.getElementById("friendSearchInput").addEventListener("input", () => {updateResultList()});
getCurrentFriendsList();
