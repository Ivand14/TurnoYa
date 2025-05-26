import { CreatePreferenceRequest, MercadoPagoPayment, MercadoPagoPreference } from '@/types/mercadopago';

class MercadoPagoService {
    private baseUrl = 'https://api.mercadopago.com';
    private accessToken: string | null = null;

    constructor() {
        // El token se configurará más tarde a través de Supabase secrets
        // Por ahora iniciamos sin token para evitar errores de process.env
        this.accessToken = null;
    }

    setAccessToken(token: string) {
        this.accessToken = token;
    }

    async createPreference(preferenceData: CreatePreferenceRequest): Promise<MercadoPagoPreference> {
        if (!this.accessToken) {
            console.log('Mercado Pago access token no configurado - usando modo simulación');
        }

        try {
            // En un entorno real, esto se haría a través de una Edge Function en Supabase
            // Por ahora, simularemos la respuesta
            console.log('Creando preferencia de pago:', preferenceData);

            // Simulación de respuesta exitosa
            const mockPreference: MercadoPagoPreference = {
                id: `PREF_${Date.now()}`,
                init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF_${Date.now()}`,
                sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF_${Date.now()}`
            };

            return mockPreference;
        } catch (error) {
            console.error('Error creando preferencia de pago:', error);
            throw new Error('Error al crear la preferencia de pago');
        }
    }

    async getPayment(paymentId: string): Promise<MercadoPagoPayment> {
        if (!this.accessToken) {
            throw new Error('Mercado Pago access token no configurado');
        }

        try {
            const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo información del pago:', error);
            throw new Error('Error al obtener información del pago');
        }
    }

    generatePaymentUrl(preferenceId: string, sandbox: boolean = true): string {
        if (sandbox) {
            return `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
        }
        return `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    }
}

export const mercadoPagoService = new MercadoPagoService();
