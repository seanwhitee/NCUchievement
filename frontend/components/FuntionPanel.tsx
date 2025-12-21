import React from "react";
import { PanelsTopLeft } from "lucide-react";
import { Button } from "./ui/button";

export interface FunctionPanelProps {
  onToggle: () => void;
}

const FunctionPanel = (props: FunctionPanelProps) => {
  const { onToggle } = props;
  return (
    <div className="flex items-center justify-start z-50 fixed rounded-lg top-2 left-2 h-10">
      <Button onClick={onToggle} className="bg-white hover:bg-white/50">
        <PanelsTopLeft className="text-neutral-900" />
      </Button>
    </div>
  );
};

export default FunctionPanel;
