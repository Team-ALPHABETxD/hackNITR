"use client";

import React from "react";

export function ElevenLabsCallButton() {
  React.useEffect(() => {
    // Dynamically add the script only once
    if (!document.getElementById("elevenlabs-convai-script")) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed@beta";
      script.async = true;
      script.type = "text/javascript";
      script.id = "elevenlabs-convai-script";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="mt-4 flex justify-end">
      <elevenlabs-convai agent-id="agent_1301ke18yfbqf0namq9tvzr2tbxg"></elevenlabs-convai>
    </div>
  );
}
