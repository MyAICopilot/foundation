import React, { useState, useRef, useEffect } from "react"; // Add useRef here
import { sendMessageToServer } from "./components/Chatapi";
import Navbar from "./components/Navbar";
import Leftpane from "./components/Leftpane";
import Chatbox from "./components/Chatbox";
import Content from "./components/Content";
import Loginform from "./components/Loginform";

import "./styles/App.css";

const courseData = [
  {
    name: "Course 1",
    topics: ["Topic 1.1", "Topic 1.2", "Topic 1.3"],
  },
  {
    name: "Course 2",
    topics: ["Topic 2.1", "Topic 2.2"],
  },
  {
    name: "Startup Playbook",
    topics: ["The Idea", "The Team"],
  },
  // Add more courses as needed
];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messageCounter = useRef(1);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [myContent, setmyContent] = useState("");
  const [mode, setMode] = useState("Learn"); // Add this line
  const [userPrompt, setUserPrompt] = useState(""); // Add this state variable to hold the user prompt
  const [loading, setLoading] = useState(false);
  const [fileClicked, setFileClicked] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);

  const handleTopicClick = (courseIndex, topicIndex) => {
    setActiveCourse(courseIndex);
    setActiveTopic(topicIndex);
  };
  const handleLogin = ({ email, password }) => {
    const hardcodedCred = {
      email: "test@example.com",
      password: "test123",
    };

    if (email === hardcodedCred.email && password === hardcodedCred.password) {
      setUser({ email });
    } else {
      alert("Invalid Credentials!");
    }
    // Here you would typically send a request to your server to authenticate the user
    // For now, let's just simulate this process with a setTimeout function

    setTimeout(() => {
      // This is the user data you would typically receive from your server
      const userData = { id: "123", name: "John Doe", email: email };

      // Save the user data in the state
      setUser(userData);
    }, 1000);
  };

  ///////////////////////////  call from Chat  /////////////////////////////
  const handleSendMessage_chat = async (inputValue = false) => {
    if (inputValue.trim() === "") return;
    const words = inputValue.trim().split(" ");
    // Specify the maximum number of words allowed
    const maxWords = 500;

    if (words.length > maxWords) {
      alert(`Please enter a message with a maximum of ${maxWords} words.`);
      return;
    }

    // Modify here: Format message with context
    let messageWithContext = inputValue;
    if (mode && myContent) {
      messageWithContext = `Mode: ${mode}\n ${courseData[activeCourse].name}: ${courseData[activeCourse].topics[activeTopic]} \nContent: ${myContent}\n\nMessage: ${inputValue}`;
    }

    console.log(courseData[activeCourse].name);
    console.log(courseData[activeCourse].topics[activeTopic]);
    // Format message for display, which doesn't include the content
    let messageForDisplay = inputValue;
    messageForDisplay = `${mode}: ${courseData[activeCourse].name} > ${courseData[activeCourse].topics[activeTopic]}\nUser: ${inputValue}`;

    const newMessage = {
      text: messageForDisplay,
      sender: "user",
      id: `Q${messageCounter.current}`,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send the user's message to your server
    try {
      setIsWaitingForResponse(true);
      const botMessageText = await sendMessageToServer(messageWithContext);

      const botMessage = {
        text: botMessageText,
        sender: "bot",
        id: `A${messageCounter.current}`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating a response.");
    } finally {
      setIsWaitingForResponse(false);
    }
    messageCounter.current++;
    setInputValue("");
  };
  ////////////////////////////////////////////////////////////////////////////////

  const handleClearChat = () => {
    setMessages([]);
    messageCounter.current = 1;
  };

  const handleLearn = () => {
    setMode("Learn");
  };

  const handleQuiz = () => {
    setMode("Quiz"); // If Quiz corresponds to 'test' mode
  };

  const handleApply = () => {
    setMode("Apply");
  };

  useEffect(() => {
    setMode("Learn");
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="App">
      <>
        <Navbar
          handleLearn={handleLearn}
          handleQuiz={handleQuiz}
          handleApply={handleApply}
          mode={mode}
          loading={loading}
          isWaitingForResponse={isWaitingForResponse} // Add this line
        />
        <div className="panes-container">
          <Leftpane
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            mode={mode}
            setUserPrompt={setUserPrompt}
            loading={loading}
            isWaitingForResponse={isWaitingForResponse} // Add this line
            setFileClicked={setFileClicked}
            setmyContent={setmyContent}
            courseData={courseData}
            onTopicClick={handleTopicClick}
          />
          <Content
            myContent={myContent}
            setmyContent={setmyContent}
            courseData={courseData}
            activeCourse={activeCourse}
            activeTopic={activeTopic}
            mode={mode}
          />
          <div className="chatbox-container">
            <Chatbox
              handleSendMessage_chat={handleSendMessage_chat}
              messages={messages}
              setInputValue={setInputValue}
              inputValue={inputValue} // add this line
              handleClearChat={handleClearChat}
              isWaitingForResponse={isWaitingForResponse}
            />
          </div>
        </div>
      </>
    </div>
  );
}

export default App;