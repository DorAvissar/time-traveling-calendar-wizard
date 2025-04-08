
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TimeSelectProps {
  date: Date | undefined;
  onTimeChange: (hours: number, minutes: number, period: "AM" | "PM") => void;
}

const TimeSelect = ({ date, onTimeChange }: TimeSelectProps) => {
  const [hours, setHours] = useState<number>(date ? (date.getHours() % 12 || 12) : 12);
  const [minutes, setMinutes] = useState<number>(date?.getMinutes() || 0);
  const [period, setPeriod] = useState<"AM" | "PM">(date?.getHours() >= 12 ? "PM" : "AM");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");

  useEffect(() => {
    if (date) {
      if (timeFormat === "12h") {
        setHours(date.getHours() % 12 || 12);
        setPeriod(date.getHours() >= 12 ? "PM" : "AM");
      } else {
        setHours(date.getHours());
      }
      setMinutes(date.getMinutes());
    }
  }, [date, timeFormat]);

  const incrementHours = () => {
    let newHours;
    if (timeFormat === "12h") {
      newHours = hours === 12 ? 1 : hours + 1;
    } else {
      newHours = (hours + 1) % 24;
    }
    setHours(newHours);
    updateTime(newHours, minutes, period);
  };

  const decrementHours = () => {
    let newHours;
    if (timeFormat === "12h") {
      newHours = hours === 1 ? 12 : hours - 1;
    } else {
      newHours = (hours - 1 + 24) % 24;
    }
    setHours(newHours);
    updateTime(newHours, minutes, period);
  };

  const incrementMinutes = () => {
    const newMinutes = (minutes + 1) % 60;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, period);
  };

  const decrementMinutes = () => {
    const newMinutes = (minutes - 1 + 60) % 60;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, period);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (timeFormat === "12h" && value >= 1 && value <= 12) {
        setHours(value);
        updateTime(value, minutes, period);
      } else if (timeFormat === "24h" && value >= 0 && value <= 23) {
        setHours(value);
        updateTime(value, minutes, period);
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value);
      updateTime(hours, value, period);
    }
  };

  const handlePeriodChange = (value: "AM" | "PM") => {
    if (value) {
      setPeriod(value);
      updateTime(hours, minutes, value);
    }
  };

  const handleTimeFormatChange = (value: "12h" | "24h") => {
    if (value === timeFormat) return;
    
    if (value === "24h") {
      // Convert from 12h to 24h
      let hour24 = hours;
      if (period === "PM" && hours !== 12) hour24 += 12;
      if (period === "AM" && hours === 12) hour24 = 0;
      setHours(hour24);
    } else {
      // Convert from 24h to 12h
      const hour12 = hours % 12 || 12;
      const newPeriod = hours >= 12 ? "PM" : "AM";
      setHours(hour12);
      setPeriod(newPeriod);
    }
    
    setTimeFormat(value);
  };

  const updateTime = (h: number, m: number, p: "AM" | "PM") => {
    // Convert from 12-hour to 24-hour format for the callback
    let hour24 = h;
    if (timeFormat === "12h") {
      if (p === "PM" && h !== 12) hour24 += 12;
      if (p === "AM" && h === 12) hour24 = 0;
    }
    
    onTimeChange(hour24, m, p);
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time</span>
        </div>
        
        <RadioGroup 
          value={timeFormat} 
          onValueChange={(value) => handleTimeFormatChange(value as "12h" | "24h")}
          className="flex items-center space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="12h" id="12h" />
            <Label htmlFor="12h" className="text-xs cursor-pointer">12h</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="24h" id="24h" />
            <Label htmlFor="24h" className="text-xs cursor-pointer">24h</Label>
          </div>
        </RadioGroup>
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
        
        {/* AM/PM selector - only show in 12h mode */}
        {timeFormat === "12h" && (
          <div className="flex flex-col items-center justify-center ml-2">
            <ToggleGroup type="single" value={period} onValueChange={handlePeriodChange as any} className="flex flex-col">
              <ToggleGroupItem value="AM" className="w-12">AM</ToggleGroupItem>
              <ToggleGroupItem value="PM" className="w-12">PM</ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSelect;
