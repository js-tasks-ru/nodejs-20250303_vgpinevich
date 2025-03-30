import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TaskTypes } from "../tasks/task.model";

export const enum NotificationType {
  sms = "sms",
  email = "email",
}

export const LOG_NOTIFICATION_PREFIX_BY_TYPE: Readonly<Record<NotificationType, (sendTo: string) => string>> = {
  [NotificationType.sms]: (phone: string) => `SMS sent to ${phone}: `,
  [NotificationType.email]: (email: string) => `Email sent to ${email}: `,
}

export type NotificationLog  = {
  type: NotificationType
  message: string
  sendTo: string
}

export class EmailNotification {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  taskType: TaskTypes;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class SMSNotification {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
