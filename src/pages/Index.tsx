
import React, { useState } from "react";
import DateTimePicker from "@/components/DateTimePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: timeFormat === "24h" ? "2-digit" : "numeric",
      minute: "2-digit",
      hour12: timeFormat === "12h"
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Time Traveling Calendar Wizard
        </h1>
        
        <Card className="w-full shadow-lg border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Select Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center flex-col items-center">
            <DateTimePicker 
              date={selectedDate} 
              setDate={setSelectedDate}
              onTimeFormatChange={setTimeFormat}
            />
          </CardContent>
        </Card>

        {selectedDate && (
          <Card className="w-full mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Your Selected Moment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-lg font-medium text-indigo-600">
                {formatDate(selectedDate)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
