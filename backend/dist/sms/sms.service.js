"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SmsService = SmsService_1 = class SmsService {
    config;
    logger = new common_1.Logger(SmsService_1.name);
    accountSid;
    authToken;
    serviceSid;
    constructor(config) {
        this.config = config;
        this.accountSid = this.config.get('TWILIO_ACCOUNT_SID') || '';
        this.authToken = this.config.get('TWILIO_AUTH_TOKEN') || '';
        this.serviceSid = this.config.get('TWILIO_VERIFY_SERVICE_SID') || '';
    }
    async sendOtp(phoneNumber, otpCode) {
        const formatted = phoneNumber.startsWith('+')
            ? phoneNumber
            : `+216${phoneNumber}`;
        console.log('📤 Twilio Verify — Envoi OTP à:', formatted);
        const body = new URLSearchParams({
            To: formatted,
            Channel: 'sms',
        });
        const response = await fetch(`https://verify.twilio.com/v2/Services/${this.serviceSid}/Verifications`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });
        const data = await response.json();
        console.log('📥 Twilio Verify Response:', JSON.stringify(data, null, 2));
        if (!response.ok) {
            throw new Error(data?.message || `Erreur Twilio Verify HTTP ${response.status}`);
        }
        this.logger.log(`✅ OTP Twilio Verify envoyé à ${formatted} — status: ${data.status}`);
    }
    async verifyOtpCode(phoneNumber, code) {
        const formatted = phoneNumber.startsWith('+')
            ? phoneNumber
            : `+216${phoneNumber}`;
        const body = new URLSearchParams({
            To: formatted,
            Code: code,
        });
        const response = await fetch(`https://verify.twilio.com/v2/Services/${this.serviceSid}/VerificationCheck`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });
        const data = await response.json();
        console.log('Twilio VerifyCheck:', JSON.stringify(data, null, 2));
        return data.status === 'approved';
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map