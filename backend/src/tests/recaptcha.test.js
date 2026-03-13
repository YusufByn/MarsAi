// ============================================
// RECAPTCHA SERVICE TESTS
// ============================================
// Tests unitaires pour le service de vérification reCAPTCHA

import { verifyRecaptchaToken } from '../services/recaptcha.service.js';

describe('reCAPTCHA Service', () => {
  
  test('should return error when token is missing', async () => {
    const result = await verifyRecaptchaToken(null);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('reCAPTCHA token is missing');
  });

  test('should return error when token is empty string', async () => {
    const result = await verifyRecaptchaToken('');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('reCAPTCHA token is missing');
  });

  test('should return error when token is only whitespace', async () => {
    const result = await verifyRecaptchaToken('   ');
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('reCAPTCHA token is missing');
  });

  test('should return error for invalid token', async () => {
    const result = await verifyRecaptchaToken('invalid_token_12345');
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('invalid');
  });

  // Note: Pour tester un token valide, vous devez générer un vrai token
  // depuis le frontend car les tokens reCAPTCHA expirent après 2 minutes
  test.skip('should return success for valid token', async () => {
    const validToken = 'REMPLACER_PAR_UN_VRAI_TOKEN';
    const result = await verifyRecaptchaToken(validToken);
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('Human verified ✓');
  });
});
