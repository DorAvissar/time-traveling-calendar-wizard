
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeSelectProps {
  date: Date | undefined;
  onTimeChange: (hours: number, minutes: number) => void;
}

const TimeSelect = ({ date, onTimeChange }: TimeSelectProps) => {
  const [hours, setHours] = useState<number>(date?.getHours() || 12);
  const [minutes, setMinutes] = useState<number>(date?.getMinutes() || 0);

  useEffect(() => {
    if (date) {
      setHours(date.getHours());
      setMinutes(date.getMinutes());
    }
  }, [date]);

  const incrementHours = () => {
    const newHours = (hours + 1) % 24;
    setHours(newHours);
    onTimeChange(newHours, minutes);
  };

  const decrementHours = () => {
    const newHours = (hours - 1 + 24) % 24;
    setHours(newHours);
    onTimeChange(newHours, minutes);
  };

  const incrementMinutes = () => {
    const newMinutes = (minutes + 1) % 60;
    setMinutes(newMinutes);
    onTimeChange(hours, newMinutes);
  };

  const decrementMinutes = () => {
    const newMinutes = (minutes - 1 + 60) % 60;
    setMinutes(newMinutes);
    onTimeChange(hours, newMinutes);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseInt(e.target.value);
    if (!isNaN(newHours) && newHours >= 0 && newHours <= 23) {
      setHours(newHours);
      onTimeChange(newHours, minutes);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(e.target.value);
    if (!isNaN(newMinutes) && newMinutes >= 0 && newMinutes <= 59) {
      setMinutes(newMinutes);
      onTimeChange(hours, newMinutes);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center mb-1">
        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time</span>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={incrementHours}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          <Input
            type="text"
            value={hours.toString().padStart(2, '0')}
            onChange={handleHoursChange}
            className="w-14 text-center"
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={decrementHours}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Label className="text-xs mt-1">Hours</Label>
        </div>
        
        <div className="text-xl font-bold">:</div>
        
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={incrementMinutes}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          <Input
            type="text"
            value={minutes.toString().padStart(2, '0')}
            onChange={handleMinutesChange}
            className="w-14 text-center"
          />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={decrementMinutes}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Label className="text-xs mt-1">Minutes</Label>
        </div>
      </div>
    </div>
  );
};

export default TimeSelect;
