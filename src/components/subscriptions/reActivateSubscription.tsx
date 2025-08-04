import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface reactivateSubscriptionProps {
  status: string;
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

  const plans = [
    {
      name: "Básico",
      description: "Perfecto para pequeños negocios que inician",
      monthlyPrice: 15000,
      ctaText: "Reactivar ahora",
      free_trial: 7,
      isAvailable: true,
    },
    {
      name: "Profesional",
      description: "Ideal para negocios en crecimiento",
      monthlyPrice: 20000,
      ctaText: "Próximamente",
      free_trial: 0,
      isAvailable: false,
    },
  ];

  return (
    <div className=" p-4 flex items-center justify-center">
      {status === "cancelled" ? (
        <div className="max-w-2xl mx-auto">
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className="hover:shadow-md transition-shadow"
              >
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
                  >
                    {plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className="hover:shadow-md transition-shadow"
              >
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
                  >
                    Plan Actual
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactivateSubscription;
