// ============================================================
//  backend/src/email/email.service.ts
//  ✅ Resend API via fetch natif Node 20
//  ✅ Envoie toujours à FIXED_RECEIVER_EMAIL (compte gratuit)
// ============================================================
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger     = new Logger(EmailService.name);
  private readonly RESEND_URL = 'https://api.resend.com/emails';

  async sendOtpEmail(
    otpCode:    string,
    firstName?: string,
  ): Promise<void> {
    const displayName = firstName?.trim() || 'Client';
    const toEmail     = process.env.FIXED_RECEIVER_EMAIL!;

 const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ATB - Code de vérification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
  
  <!-- Conteneur principal -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Carte email - largeur fixe élégante -->
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width: 520px; width: 100%; background-color: #ffffff;">
          
          <!-- Header : juste le logo/banque -->
          <tr>
            <td style="padding: 0 0 30px 0;">
              <span style="font-size: 20px; font-weight: 400; color: #000000; letter-spacing: -0.3px;">ARAB TUNISIAN BANK</span>
            </td>
          </tr>
          
          <!-- Ligne de séparation fine -->
          <tr>
            <td style="padding: 0 0 30px 0;">
              <table width="60" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height: 2px; background-color: #8a1002; width: 60px;"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Objet invisible mais présent -->
          <tr>
            <td style="padding: 0 0 20px 0;">
              <span style="font-size: 14px; color: #999999; text-transform: uppercase; letter-spacing: 0.5px;">SÉCURITÉ · CODE DE VÉRIFICATION</span>
            </td>
          </tr>
          
          <!-- Corps du message -->
          <tr>
            <td style="padding: 0 0 25px 0;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Bonjour ${displayName},
              </p>
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Vous avez demandé un code de vérification pour finaliser votre demande d'ouverture de compte Digipack.
              </p>
              <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Voici votre code à usage unique :
              </p>
            </td>
          </tr>
          
          <!-- Code OTP - très sobre, juste le code -->
          <tr>
            <td style="padding: 10px 0 30px 0;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 400; color: #000000; letter-spacing: 8px;">${otpCode}</span>
            </td>
          </tr>
          
          <!-- Durée de validité -->
          <tr>
            <td style="padding: 0 0 30px 0;">
              <p style="margin: 0; font-size: 15px; color: #666666;">
                Ce code est valable <span style="color: #000000;">10 minutes</span>.
              </p>
            </td>
          </tr>
          
          <!-- Informations de sécurité - discrètes mais claires -->
          <tr>
            <td style="padding: 25px 0; border-top: 1px solid #eeeeee; border-bottom: 1px solid #eeeeee;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="16" valign="top" style="font-size: 14px; color: #999999; padding-right: 10px;">—</td>
                  <td style="padding-bottom: 12px; font-size: 14px; color: #666666;">Ne partagez jamais ce code</td>
                </tr>
                <tr>
                  <td width="16" valign="top" style="font-size: 14px; color: #999999; padding-right: 10px;">—</td>
                  <td style="padding-bottom: 12px; font-size: 14px; color: #666666;">ATB ne vous le demandera jamais par téléphone</td>
                </tr>
                <tr>
                  <td width="16" valign="top" style="font-size: 14px; color: #999999; padding-right: 10px;">—</td>
                  <td style="font-size: 14px; color: #666666;">3 tentatives maximum</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Message si non demandé -->
          <tr>
            <td style="padding: 30px 0 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #999999; line-height: 1.6;">
                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.
              </p>
            </td>
          </tr>
          
          <!-- Footer institutionnel -->
          <tr>
            <td style="padding: 30px 0 0 0; border-top: 1px solid #eeeeee;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size: 13px; color: #999999; line-height: 1.5;">
                    Arab Tunisian Bank<br>
                    71 143 000 · www.atb.com.tn
                  </td>
                  <td align="right" style="font-size: 12px; color: #cccccc;">
                    © 2026
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 20px; font-size: 12px; color: #cccccc;">
                    Ce message vous est adressé automatiquement.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;
    const response = await fetch(this.RESEND_URL, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'ATB Digipack <onboarding@resend.dev>',
        to:      [toEmail],
        subject: 'Votre code de vérification ATB Digipack',
        html:    htmlContent,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      this.logger.error(`❌ Échec envoi email — status ${response.status}`, JSON.stringify(err));
      throw new InternalServerErrorException(
        "Impossible d'envoyer l'email de vérification. Réessayez.",
      );
    }

    this.logger.log(`✅ OTP email envoyé à ${toEmail}`);
  }
}