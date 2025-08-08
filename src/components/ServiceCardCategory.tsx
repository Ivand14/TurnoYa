import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Tag } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types";
import { ServiceCard } from "./ServiceCard";

interface ServiceCardCategoryProps {
  service: Service[];
  onReserve?: (serviceId: string) => void;
  goToCalendar: (ref: React.RefObject<HTMLDivElement>) => void;
}

interface GroupedServices {
  [category: string]: Service[];
}

const ServiceCardCategory: React.FC<ServiceCardCategoryProps> = ({
  service,
  goToCalendar,
  onReserve,
}) => {
  const calendarRef = useRef(null);

  const getCategoryColor = (category: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ];

    const index = category.length % colors.length;
    return colors[index];
  };

  const grouped = useMemo(() => {
    return service.reduce((acc, service) => {
      const category = service.category;
      if (!category) return acc;
      if (!acc[service.category]) acc[service.category] = [];
      acc[service.category].push(service);
      return acc;
    }, {});
  }, [service]);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, servicesInCategory], index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value={category}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors group [&[data-state=open]]:bg-gray-50">
                <div className="flex items-center justify-between w-full mr-4">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 ${getCategoryColor(
                        category
                      )} rounded-full mr-3 group-hover:scale-110 transition-transform`}
                    />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {category}
                      </h3>
                      {servicesInCategory.length > 1 && (
                        <p className="text-sm text-gray-500">
                          {servicesInCategory.length} servicio
                          {servicesInCategory.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors"
                  >
                    {servicesInCategory.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <div className="bg-gray-50 border-t border-gray-100">
                  <div className="p-4 space-y-3">
                    {servicesInCategory.map((service, serviceIndex) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: serviceIndex * 0.05,
                        }}
                      >
                        <ServiceCard
                          service={service}
                          onReserve={onReserve}
                          goToCalendar={goToCalendar}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceCardCategory;
