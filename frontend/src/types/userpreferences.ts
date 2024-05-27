export type UserPreferences = {
  userId: number;
  systemNotificationOrderStatus: boolean;
  emailNotificationOrderStatus: boolean;
  systemNotificationOrderRequest: boolean;
  emailNotificationOrderRequest: boolean;
};

export enum UserPreferenceType {
  SYSTEMNOTIFICATIONORDERSTATUS,
  EMAILNOTIFICATIONORDERSTATUS,
  SYSTEMNOTIFICATIONORDERREQUEST,
  EMAILNOTIFICATIONORDERREQUEST,
}
