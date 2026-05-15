
const STORAGE_KEY = "oxy_recent_chats";
let currentUsername = "";
let sessions = [];
let currentSession = null;

// 🔐 LOGIN
async function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let errorEl = document.getElementById("error");

    if (!username) {
        errorEl.innerText = "❌ Please enter a username";
        return;
    }

    if (!password) {
        errorEl.innerText = "❌ Please enter a password";
        return;
    }

    try {
        let res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        let data = await res.json();

        if (data.ok) {
            errorEl.innerText = "";
            currentUsername = username;
            document.getElementById("chat-username").textContent = username;
            loadUserChats(username);
            startNewSession();
            document.getElementById("lock-screen").style.display = "none";
            document.getElementById("chat").style.display = "flex";
            document.getElementById("msg").focus();
        } else {
            errorEl.innerText = "❌ Wrong username or password";
        }
    } catch (error) {
        errorEl.innerText = "❌ Error connecting to server";
        console.error(error);
    }
}

function loadUserChats(username) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    sessions = stored[username] || [];
    renderRecentChats();
}

function saveUserChats() {
    if (!currentUsername) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    stored[currentUsername] = sessions;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

function updateChatTitle() {
    const titleEl = document.getElementById("chat-title");
    if (!titleEl || !currentSession) return;
    titleEl.textContent = currentSession.title || "New Chat";
}

function renderRecentChats() {
    const list = document.querySelector(".sidebar-list");
    list.innerHTML = "";

    if (!sessions.length) {
        const emptyLi = document.createElement("li");
        emptyLi.className = "sidebar-list-empty";
        emptyLi.textContent = "No recent chats yet.";
        list.appendChild(emptyLi);
        return;
    }

    sessions.slice().reverse().forEach(session => {
        const li = document.createElement("li");
        li.textContent = session.title;
        li.onclick = () => selectRecentChat(session.id);
        list.appendChild(li);
    });
}

function selectRecentChat(sessionId) {
    if (currentSession && currentSession.messages.length) {
        saveCurrentSession();
    }
    openSession(sessionId);
}

function newChat() {
    startNewSession();
}

function startNewSession() {
    if (currentSession && currentSession.messages.length) {
        saveCurrentSession();
    }

    currentSession = {
        id: "session-" + Date.now(),
        title: "New Chat",
        messages: []
    };

    renderChatBox();
    renderRecentChats();
    updateChatTitle();
}

function openSession(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    currentSession = JSON.parse(JSON.stringify(session));
    renderChatBox();
    updateChatTitle();
    document.getElementById("msg").focus();
}

function saveCurrentSession() {
    if (!currentUsername || !currentSession || !currentSession.messages.length) return;

    const existingIndex = sessions.findIndex(s => s.id === currentSession.id);
    const snapshot = JSON.parse(JSON.stringify(currentSession));

    if (existingIndex >= 0) {
        sessions[existingIndex] = snapshot;
    } else {
        sessions.push(snapshot);
    }

    saveUserChats();
    renderRecentChats();
}

function renderChatBox() {
    const box = document.getElementById("chat-box");
    box.innerHTML = "";

    if (!currentSession || !currentSession.messages.length) {
        box.innerHTML = '<div class="msg ai">👋 Hello! I\'m powered by Ismail Souilkate. How can I help you today?</div>';
        updateChatTitle();
        return;
    }

    currentSession.messages.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.className = "msg " + (msg.sender === "user" ? "user" : "ai");
        msgDiv.textContent = msg.text;
        box.appendChild(msgDiv);
    });

    box.scrollTop = box.scrollHeight;
    updateChatTitle();
}

// 🚪 LOGOUT
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        currentUsername = "";
        sessions = [];
        currentSession = null;
        document.getElementById("lock-screen").style.display = "flex";
        document.getElementById("chat").style.display = "none";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("error").innerText = "";
        document.getElementById("chat-box").innerHTML = '<div class="msg ai">👋 Hello! I\'m powered by Google Gemini. How can I help you today?</div>';
    }
}

// 💬 SEND MESSAGE
async function send() {
    let msg = document.getElementById("msg").value.trim();

    if (!msg) return;
    if (!currentSession) {
        startNewSession();
    }

    if (currentSession.messages.length === 0) {
        currentSession.title = msg.length > 40 ? msg.slice(0, 40).trim() + "..." : msg;
        renderRecentChats();
    }

    currentSession.messages.push({ sender: "user", text: msg });
    renderChatBox();

    document.getElementById("msg").value = "";
    const box = document.getElementById("chat-box");
    box.scrollTop = box.scrollHeight;

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "msg ai";
    loadingDiv.textContent = "⏳ Thinking...";
    box.appendChild(loadingDiv);
    box.scrollTop = box.scrollHeight;

    try {
        let res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: msg,
                username: currentUsername
            })
        });

        let data = await res.json();
        box.removeChild(loadingDiv);

        if (data.ok) {
            currentSession.messages.push({ sender: "ai", text: data.reply });
            renderChatBox();
            saveCurrentSession();
        } else {
            const errorDiv = document.createElement("div");
            errorDiv.className = "msg ai";
            errorDiv.textContent = "❌ " + (data.reply || "Error getting response");
            box.appendChild(errorDiv);
        }

        box.scrollTop = box.scrollHeight;
    } catch (error) {
        box.removeChild(loadingDiv);
        const errorDiv = document.createElement("div");
        errorDiv.className = "msg ai";
        errorDiv.textContent = "❌ Error connecting to server: " + error.message;
        box.appendChild(errorDiv);
        console.error(error);
    }

    document.getElementById("msg").focus();
}

// 🗑️ CLEAR CHAT
async function clearChat() {
    if (!confirm("Are you sure you want to clear the chat?")) return;

    if (currentSession && currentSession.messages.length) {
        saveCurrentSession();
    }

    currentSession = {
        id: "session-" + Date.now(),
        title: "New Chat",
        messages: []
    };

    renderChatBox();
    updateChatTitle();

    try {
        await fetch("/clear-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: currentUsername })
        });
    } catch (error) {
        console.error(error);
    }
}

// ⌨️ ENTER KEY HANDLER
function handleKeyPress(event) {
    if (event.key === "Enter") {
        send();
    }
}

// Focus on username field on page load
window.addEventListener("load", function() {
    document.getElementById("username").focus();
});