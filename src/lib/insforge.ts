import { createClient } from '@insforge/sdk';

const rawBaseUrl = process.env.NEXT_PUBLIC_INSFORGE_BASE_URL || 'https://2ipa33bu.eu-central.insforge.app';
const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

export const insforge = createClient({
  baseUrl,
  anonKey
});
