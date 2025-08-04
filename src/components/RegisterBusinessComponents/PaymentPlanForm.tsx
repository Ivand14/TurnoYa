import { Building2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SubscriptionSelector } from "@/components/subscriptions/SubscriptionSelector";
import { BusinessFormValues } from "@/types/business";

interface PaymentPlanFormProps {
  form: UseFormReturn<BusinessFormValues>;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const PaymentPlanForm = ({
  form,
  onPrev,
  onSubmit,
  isSubmitting,
}: PaymentPlanFormProps) => {
  const handlePlanSelect = (planId: string) => {
    console.log(planId);
    form.setValue("subscriptionPlan", planId, { shouldValidate: true });
  };

  const valuesForLocalStorage = form.getValues();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Subscription Plan Selection */}
      <FormField
        control={form.control}
        name="subscriptionPlan"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <SubscriptionSelector
                selectedPlan={field.value}
                onPlanSelect={handlePlanSelect}
                businessRegister={valuesForLocalStorage}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="order-2 sm:order-1 flex-1 h-12 sm:h-14 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base sm:text-lg transition-all duration-300"
        >
          Volver
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="order-1 sm:order-2 flex-1 h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">
                Registrando tu negocio...
              </span>
              <span className="sm:hidden">Registrando...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span className="hidden sm:inline">Registrar Mi Negocio</span>
              <span className="sm:hidden">Registrar</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
