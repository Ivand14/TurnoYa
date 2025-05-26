import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ServiceFormProps {
  businessId: string;
  onSubmit: (service: Service) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ businessId, onSubmit }) => {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setNewService((prev) => ({
      ...prev,
      [name]:
        name === "duration" || name === "price" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newService.name) {
      toast.error("El nombre del servicio es requerido");
      return;
    }

    if (newService.duration <= 0) {
      toast.error("La duración debe ser mayor a 0");
      return;
    }

    if (newService.price < 0) {
      toast.error("El precio no puede ser negativo");
      return;
    }

    onSubmit({
      businessId,
      name_service: newService.name,
      description: newService.description,
      duration: newService.duration,
      price: newService.price,
      active: true
    });

    // Reset form
    setNewService({
      name: "",
      description: "",
      duration: 30,
      price: 0
    });

    toast.success("Servicio agregado correctamente");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Nuevo Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre del Servicio *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Corte de cabello"
              value={newService.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe el servicio"
              value={newService.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duración (minutos) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="30"
                value={newService.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0"
                placeholder="0.00"
                value={newService.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Agregar Servicio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
