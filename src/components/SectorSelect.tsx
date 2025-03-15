
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SectorSelectProps {
  sectors: string[];
  selectedSector: string;
  onChange: (sector: string) => void;
}

const SectorSelect: React.FC<SectorSelectProps> = ({
  sectors,
  selectedSector,
  onChange
}) => {
  return (
    <Select value={selectedSector} onValueChange={onChange}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select Sector" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Sectors</SelectItem>
        {sectors.map((sector) => (
          <SelectItem key={sector} value={sector}>
            {sector}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SectorSelect;
