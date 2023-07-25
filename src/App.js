import React, { useState, useRef, useEffect } from "react"; // Add useRef here
import Navbar from "./components/Navbar";
import Leftpane from "./components/Leftpane";
import Chatbox from "./components/Chatbox";
import Learnmode from "./components/Learnmode";
import Applymode from "./components/Applymode";
import Loginform from "./components/Loginform";
import axios from "axios";

import "./styles/App.css";

const courseData = [
  {
    name: "Strategy",
    topics: [
      "SWOT Analysis",
      "Porter's 5 Forces",
      "PESTEL Analysis",
      "Force Field Analysis",
      "Asset Flow Analysis",
      "Strategic Option Assessment",
      "Value Map",
      "Value Bar",
      "Value Net",
      "Choice Map",
      "Game Theory",
      "Cost Profile",
      "Negotiation",
      // "Value Creation - Value Capture Map",
    ],
  },
  {
    name: "Marketing",
    topics: [
      "TAM-SAM-SOM",
      "Customer Lifetime Value",
      "Purchase Funnel",
      "Break-even Analysis",
      "Conjoint Analysis",
      "Target Map",
      "Product Adoption curve",
      "Dynamic Pricing",
    ],
  },
  {
    name: "Decision Models",
    topics: [
      "Decision Tree",
      "Newsvendor Model",
      "Tornado Chart",
      "Sensitivity Analysis",
      "Overbooking Analysis",
      "Influence Diagram",
      "Utility Function Theory",
      "Random Walks",
    ],
  },
  // Add more courses as needed
];

function App() {
  // const [messages, setMessages] = useState([]);
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
  const [activeCourse, setActiveCourse] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [templateUpdate, setTemplateUpdate] = useState([]); // Add this line
  const [templateData, setTemplateData] = useState({});

  const [swotUpdate, setSwotUpdate] = useState([]);
  const [porterUpdate, setPorterUpdate] = useState([]);
  const [pestelUpdate, setPestelUpdate] = useState([]);
  const [forcefieldUpdate, setForceFieldUpdate] = useState([]);
  const [assetflowUpdate, setAssetFlowUpdate] = useState([]);
  const [strategicoptionUpdate, setStrategicOptionUpdate] = useState([]);
  const [valuemapUpdate, setValueMapUpdate] = useState([]);
  const [gridUpdate, setGridUpdate] = useState([]);

  const handleTopicClickUpdate = (title, newData) => {
    setTemplateData((prevData) => ({
      ...prevData,
      [title]: newData,
    }));
  };

  const [messages, setMessages] = useState([
    {
      sender: "Bot",
      text: "Please explain your business idea or scenario and we will do business analysis based on the business framework that you have selected in the leftpane (SWOT, PESTEL, etc)",
      id: `A0`,
    },
  ]);

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
      sender: "user",
      mode: mode,
      topic: courseData[activeCourse].name,
      subtopic: courseData[activeCourse].topics[activeTopic],
      text: messageForDisplay,
      id: `Q${messageCounter.current}`,
    };
    let updatedChatHistory = [...chatHistory, newMessage];
    setChatHistory(updatedChatHistory);

    // Send the user's message to your server
    try {
      setIsWaitingForResponse(true);
      // const botMessageText = await sendMessageToServer(messageWithContext);
      // const response = await axios.post("http://localhost:3010/gpt-call", {

      const response = await axios.post(
        "https://foundation-9e297d48523a.herokuapp.com/gpt-call",
        {
          chatHistory: updatedChatHistory,
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }
      console.log(response.data);

      const botMessage = {
        sender: "Bot",
        mode: mode,
        topic: courseData[activeCourse].name,
        subtopic: courseData[activeCourse].topics[activeTopic],
        text: response.data.completion,
        id: `A${messageCounter.current}`,
      };

      setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);
      setMessages((prevMessages) => [...prevMessages, newMessage, botMessage]);
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
    setChatHistory([]); // Add this line to clear the chat history
    messageCounter.current = 1;
    setInputValue("");
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

  ///////////////////  call for update template ////////////////////
  const handleTemplateUpdate = async () => {
    try {
      // Send the chat history to your server
      // const response = await axios.post(
      //   "http://localhost:3010/update-template",{}

      const response = await axios.post(
        "https://foundation-9e297d48523a.herokuapp.com/update-template",
        {
          chatHistory,
        }
      );

      // Expect the response to be an array of strings, where each string is the new content for a textarea
      const Templateupdate = Object.values(response.data);
      console.log(Templateupdate);
      // setTemplateUpdate(Templateupdate); // update state here
      // Check the active topic and update the corresponding state
      setGridUpdate(Templateupdate);
      switch (courseData[activeCourse].topics[activeTopic]) {
        case "SWOT Analysis":
          setSwotUpdate(Templateupdate);
          break;
        case "Porter's 5 Forces":
          setPorterUpdate(Templateupdate);
          break;
        case "PESTEL Analysis":
          setPestelUpdate(Templateupdate);
          break;
        case "Force Field Analysis":
          setForceFieldUpdate(Templateupdate);
          break;
        case "Asset Flow Analysis":
          setAssetFlowUpdate(Templateupdate);
          break;
        case "Strategic Option Assessment":
          setStrategicOptionUpdate(Templateupdate);
          break;
        case "Value Map":
          setValueMapUpdate(Templateupdate);
          break;
        // and so on for other topics...
        default:
          break;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    switch (courseData[activeCourse].topics[activeTopic]) {
      case "SWOT Analysis":
        setGridUpdate(swotUpdate);
        break;
      case "Porter's 5 Forces":
        setGridUpdate(porterUpdate);
        break;
      case "PESTEL Analysis":
        setGridUpdate(pestelUpdate);
        break;
      case "Force Field Analysis":
        setGridUpdate(forcefieldUpdate);
        break;
      case "Asset Flow Analysis":
        setGridUpdate(assetflowUpdate);
        break;
      case "Strategic Option Assessment":
        setGridUpdate(strategicoptionUpdate);
        break;
      case "Value Map":
        setGridUpdate(valuemapUpdate);
        break;
      // and so on for other topics...
      default:
        break;
    }
  }, [activeTopic]);

  ///////////////////  call for download template ////////////////////

  async function handledownloadButtonClick() {
    try {
      const replacements = {};
      // Extract the chat history from the state
      const chatHistory = messages
        .map((message) => `${message.sender}: ${message.text}`)
        .join("\n");

      // Create the body of the POST request
      const body = {
        replacements,
        chatHistory,
      };

      // const response = await fetch("http://localhost:3010/download-template", {
      const response = await axios.post(
        "https://foundation-9e297d48523a.herokuapp.com/download-template",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Convert response into a blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary download link
      const link = document.createElement("a");
      link.href = url;

      // Set the download file name
      link.download = "updated_template.pptx";

      // Programmatically click the download link to start the download
      link.click();
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
            activeCourse={activeCourse}
            activeTopic={activeTopic}
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
          {mode === "Apply" ? (
            <Applymode
              title={`${courseData[activeCourse].name} > ${courseData[activeCourse].topics[activeTopic]}`}
              handleTopicClickUpdate={handleTopicClickUpdate}
              gridUpdate={gridUpdate}
              storedTemplateData={
                templateData[
                  `${courseData[activeCourse].name} > ${courseData[activeCourse].topics[activeTopic]}`
                ] || {}
              }
            />
          ) : (
            <Learnmode
              myContent={myContent}
              setmyContent={setmyContent}
              courseData={courseData}
              activeCourse={activeCourse}
              activeTopic={activeTopic}
              mode={mode}
            />
          )}
          <div className="chatbox-container">
            <Chatbox
              handleSendMessage_chat={handleSendMessage_chat}
              messages={messages}
              setInputValue={setInputValue}
              inputValue={inputValue} // add this line
              handleClearChat={handleClearChat}
              isWaitingForResponse={isWaitingForResponse}
              handledownloadButtonClick={handledownloadButtonClick}
              handleTemplateUpdate={handleTemplateUpdate}
            />
          </div>
        </div>
      </>
    </div>
  );
}

export default App;
