import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import TimeSelect from "./TimeSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onTimeFormatChange?: (format: "12h" | "24h") => void;
}

type SelectionStep = "year" | "month" | "day" | "time";

const DateTimePicker = ({ 
  date, 
  setDate, 
  onTimeFormatChange 
}: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<SelectionStep>("year");
  const [tempDate, setTempDate] = useState<Date>(date || new Date());
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => Math.max(2025, currentYear) + i);
  
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleYearSelect = (year: string) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(parseInt(year));
    
    if (newDate < today) {
      newDate.setMonth(today.getMonth());
      newDate.setDate(today.getDate());
    }
    
    setTempDate(newDate);
    setCurrentStep("month");
  };

  const handleMonthSelect = (month: string) => {
    const monthIndex = months.findIndex(m => m === month);
    const newDate = new Date(tempDate);
    newDate.setMonth(monthIndex);
    
    if (newDate.getFullYear() === today.getFullYear() && 
        newDate.getMonth() < today.getMonth()) {
      newDate.setMonth(today.getMonth());
    }
    
    if (newDate.getFullYear() === today.getFullYear() && 
        newDate.getMonth() === today.getMonth() && 
        newDate.getDate() < today.getDate()) {
      newDate.setDate(today.getDate());
    }
    
    setTempDate(newDate);
    setCurrentStep("day");
  };

  const handleDaySelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(tempDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setTempDate(newDate);
      setCurrentStep("time");
    }
  };

  const handleTimeChange = (hours: number, minutes: number, period: "AM" | "PM") => {
    const newDate = new Date(tempDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setTempDate(newDate);
  };

  const handleApply = () => {
    setDate(tempDate);
    setIsOpen(false);
    setCurrentStep("year");
  };

  const handleCancel = () => {
    setIsOpen(false);
    setCurrentStep("year");
  };

  const handleBack = () => {
    switch (currentStep) {
      case "month":
        setCurrentStep("year");
        break;
      case "day":
        setCurrentStep("month");
        break;
      case "time":
        setCurrentStep("day");
        break;
    }
  };
  
  const isDateInPast = (date: Date) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date < now;
  };

  const formatButtonDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return "Pick a date & time";
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: timeFormat === "24h" ? "2-digit" : "numeric",
      minute: "2-digit",
      hour12: timeFormat === "12h"
    };
    
    return selectedDate.toLocaleString('en-US', formatOptions);
  };

  const handleTimeFormatChange = (format: "12h" | "24h") => {
    setTimeFormat(format);
    onTimeFormatChange?.(format);
  };

  return (
    <div className="flex flex-col space-y-2 w-full max-w-xs">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatButtonDate(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start" 
          side="bottom" 
          sideOffset={5}
          alignOffset={0}
          avoidCollisions={false}
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <div className="p-4 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">
                {currentStep === "year" && "Select Year"}
                {currentStep === "month" && "Select Month"}
                {currentStep === "day" && "Select Day"}
                {currentStep === "time" && "Select Time"}
              </h3>
              {currentStep !== "year" && (
                <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>

            {currentStep === "year" && (
              <div className="grid grid-cols-4 gap-2 max-h-[250px] overflow-y-auto pr-1">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant="outline"
                    className={cn(
                      "h-8",
                      tempDate.getFullYear() === year && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleYearSelect(year.toString())}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            )}

            {currentStep === "month" && (
              <div className="grid grid-cols-2 gap-2">
                {months.map((month, index) => {
                  const isDisabled = 
                    tempDate.getFullYear() === today.getFullYear() && 
                    index < today.getMonth();
                  
                  return (
                    <Button
                      key={month}
                      variant="outline"
                      className={cn(
                        "h-8",
                        tempDate.getMonth() === index && "bg-primary text-primary-foreground",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleMonthSelect(month)}
                    >
                      {month}
                    </Button>
                  );
                })}
              </div>
            )}

            {currentStep === "day" && (
              <Calendar
                mode="single"
                month={tempDate}
                selected={tempDate}
                onSelect={handleDaySelect}
                disabled={(date) => isDateInPast(date)}
                initialFocus
                className={cn("pointer-events-auto")}
              />
            )}

            {currentStep === "time" && (
              <div className="py-2">
                <TimeSelect
                  date={tempDate}
                  onTimeChange={handleTimeChange}
                  onTimeFormatChange={handleTimeFormatChange}
                />

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimePicker;
