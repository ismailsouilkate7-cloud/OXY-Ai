const chatBox = document.getElementById("chatBox");
const input = document.getElementById("msgInput");

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("message", type);
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = input.value;
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await res.json();

    addMessage(data.reply || "Error", "ai");
}