import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Business } from "@/types";

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
}

const getBusinessTypeLabel = (type: string) => {
  switch(type) {
    case 'barbershop': return 'Barbería';
    case 'beauty': return 'Centro de Belleza';
    case 'sports': return 'Centro Deportivo';
    default: return 'Negocio';
  }
};

const getBusinessTypeColor = (type: string) => {
  switch(type) {
    case 'barbershop': return 'bg-blue-100 text-blue-800';
    case 'beauty': return 'bg-pink-100 text-pink-800';
    case 'sports': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              {business.logo && <img src={business.logo} alt={business.company_name} className="w-full h-full object-cover" />}
            </div>
            <div>
              <CardTitle className="text-lg">{business.company_name}</CardTitle>
              <CardDescription className="text-xs">{business.email}</CardDescription>
            </div>
          </div>
          <Badge className={getBusinessTypeColor(business.company_type)}>
            {getBusinessTypeLabel(business.company_type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 mt-2">{business.description}</p>
        {business.address && (
          <p className="text-xs text-gray-500 mt-3 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {business.address}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
