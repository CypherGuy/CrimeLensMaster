import React, { useState, useRef } from "react";

const SpeechListener = ({ onTriggerSOS }) => {
  const [active, setActive] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!active) {
      try {
        // Create recognition instance if it doesn't exist yet.
        if (!recognitionRef.current) {
          const recognition = new window.webkitSpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = "en-US";

          recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
              }
            }
            console.log("Recognized speech:", transcript);
            if (transcript.includes("help me") || transcript.includes("emergency") || transcript.includes("peter peter")){
              console.log("🚨 Emergency phrase detected! Triggering SOS...");
              onTriggerSOS();
            }
          };

          recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event);
          };

          recognitionRef.current = recognition;
        }
        // Start recognition on click.
        recognitionRef.current.start();
        setActive(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    } else {
      try {
        recognitionRef.current.stop();
        setActive(false);
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  return (
    <div
      className="fixed bottom-4 left-4 cursor-pointer"
      onClick={toggleListening}
    >
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center opacity-50">
        {active ? (
          <span role="img" aria-label="Listening" className="text-lg">
            🎙
          </span>
        ) : (
          <span role="img" aria-label="Mic off" className="text-lg">
            🔴
          </span>
        )}
      </div>
    </div>
  );
};

export default SpeechListener;
