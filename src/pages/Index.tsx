
import React, { useState } from "react";
import DateTimePicker from "@/components/DateTimePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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
          <CardContent className="flex justify-center">
            <DateTimePicker 
              date={selectedDate} 
              setDate={setSelectedDate} 
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
                {selectedDate.toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
