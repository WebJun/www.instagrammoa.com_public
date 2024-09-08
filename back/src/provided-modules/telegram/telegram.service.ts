import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private botToken = process.env.TELEGRAM_BOT_TOKEN;
  private chatId = process.env.TELEGRAM_CHAT_ID;

  async send(message: string): Promise<void> {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          params: {
            chat_id: this.chatId,
            text: message,
          },
        },
      );

      if (response.status === 200) {
        this.logger.debug('메시지가 전송되었습니다.');
      } else {
        this.logger.error('메시지 전송 실패');
      }
    } catch (error) {
      this.logger.error('메시지 전송 중 오류 발생:', error.message);
    }
  }
}
