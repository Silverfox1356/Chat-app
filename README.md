# NexChat

NexChat is a chatting application that provides a real-time communication using socket.io and it stores user's details and messages in an encrypted format using MongoDB database. It provides a features like user can set an avatar for their profile and emoji 
support along with messages enhancing user's experience

## Tech Stack

- **Client:** React JS
- **Server:** Node JS, Express JS, Socket.io
- **Database:** MongoDB

## Preview
### 1. Register Page
![chat-app](public/src/assets/nex-1register.png)
### 2. Login Page
![chat-app](public/src/assets/nex-1login.png)
### 3. SetAvatar Page
![chat-app](public/src/assets/nex-1avatar.png)
### 4. Welcome Page
![chat-app](public/src/assets/nex-1welcome.png)
### 5. Chatting Page
![chat-app](public/src/assets/nex-1chat.png)

## Project Setup

1. Clone the repository:
```bash
git clone https://github.com/Silverfox1356/Chat-app.git
cd chat-app
 ```
2. Install the necessary dependencies:
```bash
cd client
npm install
cd ../server
npm install
```

3. Configure environment variables. Copy `.env.example` to `.env` in both
   the `client` and `server` folders and update the URLs to match your
   deployment or testing environment.

   If you expose the server using **ngrok**, add the special
   `ngrok-skip-browser-warning` header for all HTTP requests and include
   `?ngrok-skip-browser-warning=true` when establishing Socket.IO connections.

4. Run the App

Navigate to server directory and start the server
```bash
cd server
npm start
```

Navigate to client directory and start the application
```bash
cd ../client
npm start
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.



