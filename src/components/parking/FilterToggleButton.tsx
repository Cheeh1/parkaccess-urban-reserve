
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterToggleButtonProps {
  isFilterOpen: boolean;
  onClick: () => void;
}

const FilterToggleButton = ({ isFilterOpen, onClick }: FilterToggleButtonProps) => {
  return (
    <div className="w-full mb-4 lg:hidden">
      <Button 
        onClick={onClick} 
        variant="outline" 
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filter & Sort
        </div>
        {isFilterOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default FilterToggleButton;
