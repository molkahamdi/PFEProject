import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private readonly config;
    private readonly logger;
    private readonly accountSid;
    private readonly authToken;
    private readonly serviceSid;
    constructor(config: ConfigService);
    sendOtp(phoneNumber: string, otpCode?: string): Promise<void>;
    verifyOtpCode(phoneNumber: string, code: string): Promise<boolean>;
}
