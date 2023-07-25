import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import "../styles/Learnmode.css";
import "../styles/Applymode.css";
import ApplyContent from "./Applymode"; // import the ApplyContent component

function Learnmode({
  myContent,
  setmyContent,
  courseData,
  activeCourse,
  activeTopic,
  mode,
}) {
  // const [content, setContent] = useState("");

  useEffect(() => {
    if (activeCourse !== null && activeTopic !== null) {
      // const url = `/courses/${courseData[activeCourse].name}/${
      //   courseData[activeCourse].topics[activeTopic]
      // }/${mode.toLowerCase()}.md`;
      const url = `${process.env.PUBLIC_URL}/courses/${
        courseData[activeCourse].name
      }/${
        courseData[activeCourse].topics[activeTopic]
      }/${mode.toLowerCase()}.md`;

      console.log(url);

      fetch(url)
        .then((response) => response.text())
        .then((text) => setmyContent(text))
        .catch((err) => console.log(err));
    }
  }, [activeCourse, activeTopic, mode]);

  const imageUrl =
    activeCourse !== null && activeTopic !== null
      ? `${process.env.PUBLIC_URL}/courses/${courseData[activeCourse].name}/${
          courseData[activeCourse].topics[activeTopic]
        }/${mode.toLowerCase()}.bmp`
      : "";

  // Generate title
  const title =
    activeCourse !== null && activeTopic !== null
      ? `${courseData[activeCourse].name} > ${courseData[activeCourse].topics[activeTopic]}`
      : "";

  if (mode === "Apply") {
    // render ApplyContent for Apply mode
    return <ApplyContent title={title} />;
  }
  return (
    <div className="learn-mode content-pane">
      <h1 className="content-title">{title}</h1>
      {imageUrl && <img src={imageUrl} alt={title} />}
      <ReactMarkdown>{myContent}</ReactMarkdown>
    </div>
  );
}

export default Learnmode;
