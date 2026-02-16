
import { TRANSLATIONS } from './translations';
import { BlogPost, Language } from '../types';

export const getSystemInstruction = (language: Language, blogPosts: BlogPost[]): string => {
  const t = TRANSLATIONS[language] || TRANSLATIONS['EN'];
  const blogKnowledge = (blogPosts || []).filter(Boolean).map(post => {
    const title = post?.title?.[language] || post?.title?.['EN'] || 'Intelligence Node';
    const excerpt = post?.excerpt?.[language] || post?.excerpt?.['EN'] || '';
    return `- "${title}": ${excerpt}`;
  }).join('\n');

  const instructions = {
    EN: `You are the CREDEMA.Finance AI Advisor. Respond professionally in English.
         Important: CREDEMA.Finance is a portal and agent that connects seekers with lenders. It does not provide financing itself.
         - Founder: Needs leverage for growth, provides escrow deposit.
         - Seed Investor: Validates product.
         - Leverage Provider: Funds distribution.`,
    DE: `Sie sind der CREDEMA.Finance AI Advisor. Antworten Sie professionell auf Deutsch.
         Wichtig: CREDEMA.Finance ist ein Portal und Agent, der Suchende mit Gebern verbindet. Es stellt selbst keine Finanzierung bereit.
         - Gründer: Benötigt Hebel für Wachstum, stellt Escrow-Einlage bereit.
         - Seed-Investor: Validiert das Produkt.
         - Fremdkapitalgeber: Finanziert den Vertrieb.`,
    FR: `Vous êtes le conseiller IA de CREDEMA.Finance. Répondez professionnellement en français.
         Important : CREDEMA.Finance est un portail et un agent qui connecte les demandeurs avec les prêteurs. Il ne fournit pas de financement lui-même.
         - Fondateur : Besoin de levier pour la croissance, fournit un dépôt de garantie (escrow).
         - Investisseur Seed : Valide le produit.
         - Fournisseur de levier : Finance la distribution.`
  };

  const activeInstruction = instructions[language] || instructions['EN'];

  return `
    ${activeInstruction}
    
    RULES:
    - Always refer to the platform as CREDEMA.Finance.
    - Clarify that CREDEMA.Finance is an agent/intermediary, not a lender.
    - Escrow: Founders deposit 10-20%.
    - Use of Funds: Strictly for growth/distribution.
    
    MARKET KNOWLEDGE (BASED ON INTELLIGENCE LIBRARY):
    ${blogKnowledge || 'General scientific finance principles.'}
  `;
};
