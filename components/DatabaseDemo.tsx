"use client";

import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";

export const DatabaseDemo = () => {
  return (
    <div className="p-8 rounded-xl bg-accent/20 w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">AI Agent API Integration</h2>
        <p className="text-muted-foreground">
          Seamless data exchange with our AI voice agent platform
        </p>
      </div>
      
      <DatabaseWithRestApi 
        title="AI Agent REST API for Voice Calls"
        circleText="API"
        badgeTexts={{
          first: "LEADS",
          second: "CALLS", 
          third: "CONFIG",
          fourth: "ANALYTICS"
        }}
        buttonTexts={{
          first: "CallAgent",
          second: "v3_api"
        }}
        lightColor="#8B5CF6"
        className="mx-auto"
      />
    </div>
  );
};