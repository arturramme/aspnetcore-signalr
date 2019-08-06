// const connection = new signalR.HubConnectionBuilder()
//     .withUrl("/chatHub?user=" + JSON.stringify())
//     .build();

// connection.on("ReceiveMessage", (user, message) => {
//     const rec_msg = user + ": " + message;
//     const li = document.createElement("li");
//     li.textContent = rec_msg;

//     document.getElementById("messagesList").appendChild(li);
// });

// connection.start().catch(err => console.error(err.toString()));

// document.getElementById("sendMessage").addEventListener("click", event => {
//     const user = document.getElementById("userName").value;
//     const message = document.getElementById("userMessage").value;

//     connection.invoke("SendMessageToSpecificUser", user, message).catch(err => console.error(err.toString()));
//     event.preventDefault();
// });