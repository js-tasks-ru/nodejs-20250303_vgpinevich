import { Injectable, Logger } from "@nestjs/common";
import {
  EmailNotification,
  LOG_NOTIFICATION_PREFIX_BY_TYPE,
  NotificationLog,
  NotificationType,
  SMSNotification,
} from "./notifications.model";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private log({ type, message, sendTo }: NotificationLog): void {
    const prefix = LOG_NOTIFICATION_PREFIX_BY_TYPE[type](sendTo);

    this.logger.log(prefix + message);
  }

  sendSMS(
    phoneNumber: SMSNotification["phoneNumber"],
    message: SMSNotification["message"],
  ): void {
    this.log({
      type: NotificationType.sms,
      message: message,
      sendTo: phoneNumber,
    });
  }

  sendEmail(
    email: EmailNotification["email"],
    taskType: EmailNotification["taskType"],
    message: EmailNotification["message"],
  ): void {
    this.log({
      type: NotificationType.email,
      message: `${taskType} ${message}`,
      sendTo: email,
    });
  }
}
