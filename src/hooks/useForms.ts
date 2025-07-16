import React, { useState } from "react";

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [form, setForm] = useState<T>(initialValues);

  const resetForm = () => setForm(initialValues);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return {
    form,
    resetForm,
    handleInputChange,
    setForm,
  };
}
