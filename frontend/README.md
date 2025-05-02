
# TeamUp - Social Networking Platform

Welcome to **TeamUp**, a dynamic and user-friendly social networking platform designed for seamless interaction and content sharing. TeamUp allows users to connect, create, and collaborate in a modern and intuitive interface. Below are the core features and a guide on how to set up and run the project.

---

## 🚀 Features

1. **Upload and Share Posts**  
   - Users can upload images and share their thoughts through posts.  
   - Images are handled seamlessly with the help of Multer for file uploads.

2. **Like and Comment on Posts**  
   - Express your appreciation for posts by liking them.  
   - Share your thoughts on posts by leaving comments. Comments are moderated using AI to detect and block hateful content.

3. **View User Profiles**  
   - Explore detailed user profiles showcasing their posts and personal information.

4. **Chat with Other Users**  
   - Real-time messaging system to connect and chat with users.

5. **Search Functionality**  
   - Search for users or posts by category using advanced filters.

6. **Geolocation Sharing**  
   - Share your location with others using Google Maps integration.

---

## 🛠️ Technologies Used

Here is a list of libraries and technologies used in TeamUp:  

### **Backend**  
- **Multer**: For handling image uploads.  
- **Body-Parser**: Middleware for parsing incoming request bodies.  
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.  
- **Express**: Web framework for Node.js.  
- **Cors**: Middleware to enable CORS.  
- **Dotenv**: For managing environment variables.  
- **Path & FS**: To handle file paths and file system operations.  
- **Bcrypt**: For securely hashing passwords.  
- **JWT**: for user sessions.

### **Frontend**  
- **Chakra UI**: For responsive and accessible UI components.  
- **Material UI**: To enhance the visual design of the application.  
- **Axios**: For making HTTP requests.  
- **React-DOM**: For rendering components.  
- **Recoil**: For state management in React.

### **AI Hate Comment Detection**  
- **Python**: Backend service to filter hateful comments.  

---

## 🔧 How to Run the Project

Follow the steps below to set up and run the project locally:



### 1. **Install Dependencies**

#### Backend:
   ```bash
   cd backend
   npm install
   ```

#### Frontend:
   ```bash
   cd frontend
   npm install
   ```

### 2. **Run the Project**

#### Backend Server:
   Navigate to the `backend` directory and start the server:
   ```bash
   npm start
   ```

#### Frontend Server:
   Navigate to the `frontend` directory and start the development server:
   ```bash
   npm run dev
   ```

#### AI Hate Comment Detector:
   Navigate to the AI service directory, activate the Python virtual environment, and run the detector:
   ```bash
   cd ai_hate_comment_detector
   .\venv\Scripts\activate
   python app.py
   ```

