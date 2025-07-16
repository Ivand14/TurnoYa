export interface settings {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  logo: File | string;

  // Seguridad
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;

  // Notificaciones
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;

  // Privacidad
  profilePublic: boolean;
  showEmail: boolean;
  dataCollection: boolean;
}
