import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

interface subscriptionData {
  email: string;
  amount: number;
  reason: string;
  businessId: string;
  freeTrial: number;
}

export const subscription = async (subscriptionData: subscriptionData) => {
  try {
    // const responose = await axios();
  } catch (error) {}
};
