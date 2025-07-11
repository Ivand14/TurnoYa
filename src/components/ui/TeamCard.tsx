import React from "react";
import { Card, CardContent } from "@/components/ui/card";
interface TeamCardProps {
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  name,
  role,
  description,
  icon,
}) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <CardContent className="p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{name}</h3>
        <p className="text-blue-600 font-medium mb-3">{role}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};
