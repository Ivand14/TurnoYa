import { subscription } from "@/apis/MercadoPagoApis/subscription";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { compnay_logged } from "@/context/current_company";
import { current_user } from "@/context/currentUser";

interface reactivateSubscriptionProps {
  status: string;
}

interface plansData {
  name: string;
  description: string;
  monthlyPrice: number;
  ctaText: string;
  authText: string;
  free_trial: number;
  isAvailable: boolean;
}

const ReactivateSubscription: React.FC<reactivateSubscriptionProps> = ({
  status,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const pathname = window.location.pathname;
  const { company } = compnay_logged();

  const plans: plansData[] = [
    {
      name: "Básico",
      description: "Perfecto para pequeños negocios que inician",
      monthlyPrice: 15000,
      ctaText: "Reactivar ahora",
      authText: "Plan Actual",
      free_trial: 0,
      isAvailable: true,
    },
    {
      name: "Profesional",
      description: "Ideal para negocios en crecimiento",
      monthlyPrice: 20000,
      ctaText: "Próximamente",
      authText: "Próximamente",
      free_trial: 0,
      isAvailable: false,
    },
  ];

  const reactivateSubscription = async (plan: string) => {
    const filterByPlan = plans.find((pl) => pl.name === plan);
    const { free_trial, monthlyPrice, name } = filterByPlan;
    await subscription([
      {
        free_trial,
        amount: monthlyPrice,
        reason: name,
        payer_email: company.email,
        pathname,
      },
    ]);
  };

  return (
    <div className=" p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        <div className="grid gap-4">
          {plans.map((plan) => (
            <Card key={plan.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatPrice(plan.monthlyPrice)}
                    </div>
                    <div className="text-sm text-gray-500">/mes</div>
                  </div>
                </div>
              </CardHeader>

              <CardFooter>
                <Button
                  className="w-full"
                  disabled={!plan.isAvailable}
                  variant={plan.isAvailable ? "default" : "outline"}
                  onClick={() => {
                    status !== "authorized" &&
                      reactivateSubscription(plan.name);
                  }}
                >
                  {status === "authorized" ? plan.authText : plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReactivateSubscription;
