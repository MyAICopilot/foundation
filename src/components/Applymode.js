import React, { useEffect, useState } from "react";

function Applymode({ title, gridUpdate }) {
  // Define lookup table for templates
  const templates = {
    "Strategy > SWOT Analysis": [
      { heading: "Strengths", text: "Enter strengths here" },
      { heading: "Weaknesses", text: "Enter weaknesses here" },
      { heading: "Opportunities", text: "Enter opportunities here" },
      { heading: "Threats", text: "Enter threats here" },
    ],
    "Strategy > Porter's 5 Forces": [
      { heading: "Threat of New Entrants", text: "Enter text here" },
      { heading: "Bargaining Power of Suppliers", text: "Enter text here" },
      { heading: "Bargaining Power of Buyers", text: "Enter text here" },
      { heading: "Threat of Substitute Products", text: "Enter text here" },
      {
        heading: "Rivalry Among Existing Competitors",
        text: "Enter text here",
      },
    ],
    "Strategy > PESTEL Analysis": [
      { heading: "Political", text: "Enter text here" },
      { heading: "Economic", text: "Enter text here" },
      { heading: "Social", text: "Enter text here" },
      { heading: "Technological", text: "Enter text here" },
      { heading: "Environmental", text: "Enter text here" },
      { heading: "Legal", text: "Enter text here" },
    ],
    "Strategy > Force Field Analysis": [
      { heading: "Driving Forces", text: "Enter text here" },
      { heading: "Restraining Forces", text: "Enter text here" },
    ],
    "Strategy > Asset Flow Analysis": [
      { heading: "Inbound Assets", text: "Enter text here" },
      { heading: "Internal Assets", text: "Enter text here" },
      { heading: "Outbound Assets", text: "Enter text here" },
    ],
    "Strategy > Strategic Option Assessment": [
      { heading: "Generate Strategic Options", text: "Enter text here" },
      { heading: "Evaluation Criteria", text: "Enter text here" },
      { heading: "Assessment of Strategic Options", text: "Enter text here" },
      { heading: "Decision Making", text: "Enter text here" },
      { heading: "Risk Analysis", text: "Enter text here" },
      { heading: "Implementation Plan", text: "Enter text here" },
      { heading: "Monitoring and Review", text: "Enter text here" },
      { heading: "Flexibility and Adaptability", text: "Enter text here" },
    ],

    "Strategy > Value Map": [
      { heading: "Value Proposition", text: "Enter text here" },
      { heading: "Customer Segments", text: "Enter text here" },
      { heading: "Channels", text: "Enter text here" },
      { heading: "Customer Relationships", text: "Enter text here" },
      { heading: "Revenue Streams", text: "Enter text here" },
      { heading: "Key Resources", text: "Enter text here" },
      { heading: "Key Activities", text: "Enter text here" },
      { heading: "Key Partnerships", text: "Enter text here" },
      { heading: "Cost Structure", text: "Enter text here" },
    ],
  };
  const [templateData, setTemplateData] = useState({});
  // Create state to hold the user inputs
  const [userInputs, setUserInputs] = useState({});

  // UseEffect to handle Templateupdate changes
  useEffect(() => {
    // Update the templateData state whenever Templateupdate changes
    console.log(gridUpdate);
    if (Array.isArray(gridUpdate) && gridUpdate.length > 0) {
      setTemplateData(gridUpdate[0]);
    }
  }, [gridUpdate]);

  // Determine which template to use
  const gridData =
    templates[title] ||
    Array(10).fill({ heading: "Box Heading", text: "Editable text here" });

  const headings = gridData.map((box) => box.heading);

  return (
    <div className="apply-mode content-pane">
      <h1 className="content-title">{title}</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridGap: "10px",
        }}
      >
        {headings.map((heading, index) => (
          <div key={index} className="grid-box">
            <h5>{heading}</h5>
            <textarea value={templateData[heading]}></textarea>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applymode;
