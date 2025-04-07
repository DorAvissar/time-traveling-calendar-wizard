
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

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
    <div className="flex flex-col space-y-2">
      <div className="flex items-center mb-1">
        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="hours" className="text-xs">
            Hours
          </Label>
          <Input
            id="hours"
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={handleHoursChange}
            className={cn("w-full")}
          />
        </div>
        <div>
          <Label htmlFor="minutes" className="text-xs">
            Minutes
          </Label>
          <Input
            id="minutes"
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={handleMinutesChange}
            className={cn("w-full")}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeSelect;
