
import { LoanDeal, RiskLevel, WalletStatus, BlogPost, FoundationChapter, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin-dg',
    email: 'dg@credema.finance',
    name: 'Credema Director',
    role: 'ADMIN',
    entityName: 'CREDEMA.Finance HQ',
    status: 'APPROVED',
    isLoggedIn: false
  },
  {
    id: 'investor-001',
    email: 'daniel-grossmann@hotmail.com',
    name: 'Daniel Grossmann',
    role: 'SEED_INVESTOR',
    entityName: 'Grossmann Ventures',
    status: 'APPROVED',
    isLoggedIn: false
  }
];

export const MOCK_DEALS: LoanDeal[] = [
  {
    id: 'CD-2026-001',
    ownerId: 'founder-001',
    companyName: 'NovaSynthetix AI',
    tagline: 'Generative protein synthesis at scale.',
    location: 'San Francisco, CA',
    sector: 'DeepTech',
    stage: 'SEED',
    description: 'NovaSynthetix is building the future of drug discovery using transformer architectures to predict molecular binding sites with 99% accuracy.',
    raisingAmount: 2000000,
    instrument: 'SAFE',
    valuation: 12000000,
    valuationType: 'CAP',
    minTicket: 50000,
    investorNote: "Strong technical team from DeepMind. Early pilot with Tier-1 Pharma.",
    leverageAmount: 1000000,
    depositAmount: 200000,
    leverageMultiplier: 5,
    termMonths: 24,
    monthsElapsed: 4,
    walletStatus: WalletStatus.VERIFIED,
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    lastOracleCheck: '2026-01-24',
    growthMetrics: { cac: 1500, roas: 3.2, monthlyAdSpend: 45000, conversionRate: 0.12 },
    productMetrics: { burnRate: 85000, runwayMonths: 14, githubCommits: 1250, roadmapCompletion: 0.65, betaUsers: 120 },
    ragContext: {
      problem: "Traditional drug discovery takes 10 years and costs billions. 90% of candidates fail in trials.",
      solution: "Our AI platform reduces simulation time from months to hours using high-fidelity generative models.",
      marketStrategy: "Licensing platform to mid-size biotech firms to accelerate their pipeline.",
      competition: "Schrödinger, but we are 10x faster for specific protein classes.",
      teamBackground: "Ex-Google DeepMind researchers and Pfizer computational biologists.",
      useOfFunds: "Hiring more ML engineers and securing H100 compute clusters."
    },
    seedInvestorVerified: true,
    status: 'ACTIVE'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: { EN: 'The Distribution Bottleneck', DE: 'Der Vertriebs-Engpass', FR: 'Le goulot de la distribution' },
    excerpt: { EN: 'In 2026, building software is cheap, but getting users is expensive.', DE: 'Software ist billig, Nutzergewinnung ist teuer.', FR: 'Le logiciel est peu coûteux, l\'acquisition est chère.' },
    content: {
      EN: `## Distribution is Strategy\n\nStartups fail because they cannot reach customers profitably. In 2026, the marginal cost of software has plummeted due to AI, making distribution capital the most valuable asset in the stack. By utilizing the CREDEMA.Finance triangular model, founders fund acquisition using non-dilutive leverage instead of equity. This prevents the "Series A stall" where growth flatlines because expensive equity was spent on temporary ad costs instead of long-term IP development. Our protocol ensures your cap table remains clean while your growth engine runs on institutional fuel.`,
      DE: `## Vertrieb ist Strategie\n\nStartups scheitern, weil sie Kunden nicht profitabel erreichen können. 2026 sind die Softwarekosten dank KI gesunken, was Vertriebskapital zum wichtigsten Gut macht. Mit dem CREDEMA.Finance-Modell finanzieren Gründer die Akquisition durch nicht-verwässernden Hebel statt Eigenkapital. Dies verhindert den „Series A Stillstand“, bei dem das Wachstum stagniert, weil teures Eigenkapital für Werbung statt für IP-Entwicklung ausgegeben wurde. Unser Protokoll hält Ihre Cap Table sauber, während Ihr Wachstum mit institutionellem Treibstoff läuft.`,
      FR: `## La distribution est une stratégie\n\nLes startups échouent car elles n'atteignent pas leurs clients de manière rentable. En 2026, le coût du logiciel a chuté, faisant du capital de distribution l'atout majeur. Via le modèle CREDEMA.Finance, les fondateurs financent l'acquisition par levier non dilutif. Cela évite le blocage de la "Série A" où la croissance stagne car l'équité a été gaspillée en publicité. Notre protocole garantit une table de capitalisation propre pendant que votre moteur de croissance tourne.`
    },
    category: { EN: 'Strategy', DE: 'Strategie', FR: 'Stratégie' },
    readTime: { EN: '5 min', DE: '5 Min', FR: '5 min' },
    date: { EN: 'Jan 2, 2026', DE: '2. Jan 2026', FR: '2 jan. 2026' },
    author: { name: 'Eric Gaudin', role: { EN: 'Director', DE: 'Direktor', FR: 'Directeur' } },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '2',
    title: { EN: 'Collateralized Confidence', DE: 'Besichertes Vertrauen', FR: 'Confiance Garantie' },
    excerpt: { EN: 'How physical conviction transforms early-stage risk profiles.', DE: 'Wie physische Überzeugung das Risikoprofil verändert.', FR: 'Comment la conviction physique transforme le risque.' },
    content: {
      EN: `## The End of Gut-Feeling\n\nVenture capital has long relied on intuition. CREDEMA.Finance introduces objective conviction. When a founder places a 20% deposit in escrow, they prove unit economics. This "skin in the game" lowers the risk premium for institutional providers. We verify unit economics instead of betting on people. This scientific approach allows for larger deployments and shortens the time to global scale.`,
      DE: `## Das Ende des Bauchgefühls\n\nVC verließ sich lange auf Intuition. CREDEMA.Finance führt objektive Überzeugung ein. Wenn ein Gründer 20% Einlage leistet, beweist er seine Einheitsökonomie. Dieses „Skin in the Game“ senkt die Risikoprämie für Hebelgeber. Wir verifizieren Kennzahlen statt auf Personen zu wetten. Dieser wissenschaftliche Ansatz ermöglicht größere Investitionen und schnellere Skalierung.`,
      FR: `## La fin de l'intuition\n\nLe capital-risque a longtemps reposé sur l'instinct. CREDEMA.Finance introduit la conviction objective. Quand un fondateur dépose 20% en séquestre, il prouve son modèle. Cet engagement réduit la prime de risque pour les prêteurs. Nous vérifions les chiffres au lieu de parier sur les gens. Cette approche scientifique permet des déploiements massifs.`
    },
    category: { EN: 'Finance', DE: 'Finanzen', FR: 'Finance' },
    readTime: { EN: '4 min', DE: '4 Min', FR: '4 min' },
    date: { EN: 'Jan 5, 2026', DE: '5. Jan 2026', FR: '5 jan. 2026' },
    author: { name: 'Institutional Research', role: { EN: 'Analyst', DE: 'Analyst', FR: 'Analyste' } },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '3',
    title: { EN: 'AI Infrastructure Funding', DE: 'KI-Infrastruktur Finanzierung', FR: 'Financer l\'IA' },
    excerpt: { EN: 'GPUs are the new real estate of the 2026 economy.', DE: 'GPUs sind die neuen Immobilien der Wirtschaft 2026.', FR: 'Les GPU sont le nouvel immobilier de l\'économie 2026.' },
    content: {
      EN: `## Financing Compute\n\nThe fundamental cost of 2026 startups is compute time. GPU clusters are the new factories. Using equity for recurring infrastructure is a strategic error. CREDEMA.Finance treats intelligence as an asset, allowing startups to secure growth facilities against compute revenue. This preserves 30-40% more equity for founders.`,
      DE: `## Rechenleistung finanzieren\n\nDie Kosten von Startups 2026 sind Rechenzeit. GPU-Cluster sind die neuen Fabriken. Eigenkapital für Infrastruktur zu nutzen ist ein Fehler. CREDEMA.Finance behandelt Intelligenz als Aktivposten und sichert Kredite gegen Rechenleistung-Einnahmen ab. Dies bewahrt 30-40% mehr Anteile für die Gründer.`,
      FR: `## Financer le calcul\n\nLe coût majeur des startups en 2026 est le temps de calcul. Les clusters GPU sont les nouvelles usines. Utiliser de l'équité pour l'infrastructure est une erreur. CREDEMA.Finance traite l'intelligence comme un actif, sécurisant le levier sur les revenus de calcul. Cela préserve 30-40% d'équité en plus.`
    },
    category: { EN: 'AI', DE: 'KI', FR: 'IA' },
    readTime: { EN: '4 min', DE: '4 Min', FR: '4 min' },
    date: { EN: 'Jan 8, 2026', DE: '8. Jan 2026', FR: '8 jan. 2026' },
    author: { name: 'Eric Gaudin', role: { EN: 'Director', DE: 'Direktor', FR: 'Directeur' } },
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '4',
    title: { EN: 'Oracle Monitoring', DE: 'Oracle Überwachung', FR: 'Monitoring Oracle' },
    excerpt: { EN: 'Real-time telemetry replaces the obsolete PDF report.', DE: 'Echtzeit-Telemetrie ersetzt veraltete PDF-Berichte.', FR: 'La télémétrie remplace le rapport PDF obsolète.' },
    content: {
      EN: `## Automated Trust\n\nTraditional debt relies on stale reports. CREDEMA.Finance uses Oracular Monitoring—smart contracts ingesting real-time telemetry from the operational stack. We monitor ROAS and burn with millisecond precision. Transparency allows for lower rates because hidden failure is removed. Capital moves at the speed of code.`,
      DE: `## Automatisiertes Vertrauen\n\nKredite basieren oft auf alten Berichten. CREDEMA.Finance nutzt Oracular Monitoring—Smart Contracts, die Echtzeit-Daten aus dem Stack lesen. Wir überwachen ROAS und Burn-Rate präzise. Transparenz senkt Zinsen, da Risiken sofort sichtbar sind. Kapital fließt so schnell wie Code.`,
      FR: `## Confiance Automatisée\n\nLa dette classique repose sur des rapports périmés. CREDEMA.Finance utilise le Monitoring Oraculaire—des contrats intelligents lisant les données en temps réel. Nous suivons le ROAS et le burn avec précision. La transparence réduit les taux car le risque caché est éliminé.`
    },
    category: { EN: 'Tech', DE: 'Technik', FR: 'Tech' },
    readTime: { EN: '5 min', DE: '5 Min', FR: '5 min' },
    date: { EN: 'Jan 12, 2026', DE: '12. Jan 2026', FR: '12 jan. 2026' },
    author: { name: 'Institutional Research', role: { EN: 'Analyst', DE: 'Analyst', FR: 'Analyste' } },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '5',
    title: { EN: 'The Sovereign Founder', DE: 'Der souveräne Gründer', FR: 'Le Fondateur Souverain' },
    excerpt: { EN: 'Maintaining control by decoupling capital from governance.', DE: 'Kontrolle behalten durch Trennung von Kapital und Führung.', FR: 'Garder le contrôle en découplant capital et gouvernance.' },
    content: {
      EN: `## Financial Sovereignty\n\nBoard seats slow down decision-making. Non-dilutive leverage is a tool, not a boss. Institutional lenders want returns, not veto rights. This allows founders to pivot and hire freely, answering only to customers and code. It is the ultimate competitive advantage in the AI era.`,
      DE: `## Finanzielle Souveränität\n\nVorstandssitze bremsen Entscheidungen. Hebelkapital ist ein Werkzeug, kein Chef. Kreditgeber wollen Rendite, keine Vetorechte. Gründer können frei agieren und sich nur vor Kunden und Code verantworten. Dies ist der ultimative Vorteil in der KI-Ära.`,
      FR: `## Souveraineté Financière\n\nLes sièges au conseil freinent les décisions. Le levier est un outil, pas un patron. Les prêteurs veulent du rendement, pas des vetos. Cela permet aux fondateurs d'agir librement. C'est l'avantage compétitif majeur de l'ère de l'IA.`
    },
    category: { EN: 'Market', DE: 'Markt', FR: 'Marché' },
    readTime: { EN: '4 min', DE: '4 Min', FR: '4 min' },
    date: { EN: 'Jan 15, 2026', DE: '15. Jan 2026', FR: '15 jan. 2026' },
    author: { name: 'Eric Gaudin', role: { EN: 'Director', DE: 'Direktor', FR: 'Directeur' } },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '6',
    title: { EN: 'Bridging the Valley of Death', DE: 'Die Brücke über das Tal des Todes', FR: 'Franchir la Vallée de la Mort' },
    excerpt: { EN: 'Why bridge rounds are being replaced by performance leverage.', DE: 'Warum Bridge-Runden durch Performance-Hebel ersetzt werden.', FR: 'Pourquoi les rounds intermédiaires sont remplacés par le levier.' },
    content: {
      EN: `## Efficient Growth\n\nThe gap between Seed and Series A is lethal. Bridge rounds are expensive. CREDEMA.Finance leverage allows you to prove unit economics without selling 15% of your company. You arrive at Series A with more traction and more equity, securing a massive negotiating advantage.`,
      DE: `## Effizientes Wachstum\n\nDie Lücke zwischen Seed und Series A ist tödlich. Bridge-Runden sind teuer. Der CREDEMA.Finance-Hebel erlaubt den Nachweis der Einheitsökonomie ohne Anteilsverkauf. Sie erreichen die Serie A mit mehr Traktion und mehr Anteilen, was Ihre Verhandlungsposition stärkt.`,
      FR: `## Croissance Efficace\n\nLe fossé entre Seed et Série A est mortel. Les bridge rounds coûtent cher. Le levier CREDEMA.Finance permet de prouver le modèle sans vendre 15% de la société. Vous arrivez en Série A avec plus de traction et d'équité, renforçant votre pouvoir de négociation.`
    },
    category: { EN: 'Scaling', DE: 'Skalierung', FR: 'Croissance' },
    readTime: { EN: '5 min', DE: '5 Min', FR: '5 min' },
    date: { EN: 'Jan 18, 2026', DE: '18. Jan 2026', FR: '18 jan. 2026' },
    author: { name: 'Institutional Research', role: { EN: 'Analyst', DE: 'Analyst', FR: 'Analyste' } },
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '7',
    title: { EN: 'The Transparency Premium', DE: 'Die Transparenz-Prämie', FR: 'La Prime de Transparence' },
    excerpt: { EN: 'Data-first startups access 30% cheaper capital.', DE: 'Data-First-Startups erhalten 30% günstigeres Kapital.', FR: 'Les startups Data-First accèdent à un capital 30% moins cher.' },
    content: {
      EN: `## Objective Value\n\nInformation asymmetry causes friction. Integration with the CREDEMA.Finance Oracle proves health. Lenders see ROAS and CAC in real-time, removing the trust deficit. Transparency leads to automated disbursement and lower interest rates. Founders who share data out-scale the opaque.`,
      DE: `## Objektiver Wert\n\nInformationsasymmetrie verursacht Reibung. Integration in das CREDEMA.Finance Oracle beweist Gesundheit. Kreditgeber sehen ROAS und CAC in Echtzeit. Transparenz führt zu automatischer Auszahlung und niedrigeren Zinsen. Startups mit offenen Daten skalieren schneller.`,
      FR: `## Valeur Objective\n\nL'asymétrie d'info cause de la friction. L'intégration à l'Oracle CREDEMA.Finance prouve la santé. Les prêteurs voient le ROAS en direct. La transparence mène à des déboursements auto et des taux bas. Les startups transparentes dépassent les opaques.`
    },
    category: { EN: 'Strategy', DE: 'Strategie', FR: 'Stratégie' },
    readTime: { EN: '4 min', DE: '4 Min', FR: '4 min' },
    date: { EN: 'Jan 20, 2026', DE: '20. Jan 2026', FR: '20 jan. 2026' },
    author: { name: 'Eric Gaudin', role: { EN: 'Director', DE: 'Direktor', FR: 'Directeur' } },
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '8',
    title: { EN: 'Scientific Finance', DE: 'Wissenschaftliche Finanzierung', FR: 'Finance Scientifique' },
    excerpt: { EN: 'Moving from intuition to algorithmic certainty.', DE: 'Von Intuition zu algorithmischer Gewissheit.', FR: 'De l\'intuition à la certitude algorithmique.' },
    content: {
      EN: `## Mathematical Alignment\n\nThe 20th-century venture model was high-friction. Scientific Finance aligns stakeholder incentives mathematically. Founders scale with soul intact. Investors see growth backed by telemetry. This synergy removes the "us vs them" dynamic, creating a growth machine secured by code.`,
      DE: `## Mathematische Ausrichtung\n\nDas VC-Modell des 20. Jahrhunderts war mühsam. Scientific Finance richtet Anreize mathematisch aus. Gründer skalieren ohne Kontrollverlust. Investoren sehen telemetrie-basiertes Wachstum. Diese Synergie beendet Konflikte und schafft eine code-gesicherte Wachstumsmaschine.`,
      FR: `## Alignement Mathématique\n\nLe modèle VC du 20ème siècle était complexe. La Finance Scientifique aligne les intérêts mathématiquement. Les fondateurs croissent sans se perdre. Les investisseurs voient une croissance prouvée. Cette synergie crée une machine de croissance sécurisée.`
    },
    category: { EN: 'Market', DE: 'Markt', FR: 'Marché' },
    readTime: { EN: '6 min', DE: '6 Min', FR: '6 min' },
    date: { EN: 'Jan 24, 2026', DE: '24. Jan 2026', FR: '24 jan. 2026' },
    author: { name: 'Eric Gaudin', role: { EN: 'Director', DE: 'Direktor', FR: 'Directeur' } },
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '9',
    title: { EN: 'The IP Preservation Model', DE: 'Das IP-Erhaltungsmodell', FR: 'Modèle de Préservation IP' },
    excerpt: { EN: 'Protecting the core value of tech companies.', DE: 'Schutz des Kernwerts von Technologieunternehmen.', FR: 'Protéger la valeur centrale des entreprises tech.' },
    content: {
      EN: `## Ownership Matters\n\nWhen you sell equity for ads, you sell your future IP. Non-dilutive leverage funds distribution, ensuring that the intellectual property remains in the founders' hands. In 2026, IP is the only moat. CREDEMA.Finance is the fortress that allows you to weaponize your capital without surrendering your castle.`,
      DE: `## Eigentum zählt\n\nWer Anteile für Werbung verkauft, verkauft seine IP. Hebelkapital finanziert den Vertrieb und hält das geistige Eigentum in Gründerhand. 2026 ist IP der einzige Schutz. CREDEMA.Finance ist die Festung, die Kapitalnutzung ohne Kapitulation ermöglicht.`,
      FR: `## Le capital compte\n\nVendre de l'équité pour de la pub, c'est vendre sa PI future. Le levier finance la distribution, gardant la PI aux mains des fondateurs. En 2026, la PI est le seul rempart. CREDEMA.Finance est la forteresse qui permet d'utiliser le capital sans se rendre.`
    },
    category: { EN: 'Finance', DE: 'Finanzen', FR: 'Finance' },
    readTime: { EN: '5 min', DE: '5 Min', FR: '5 min' },
    date: { EN: 'Jan 28, 2026', DE: '28. Jan 2026', FR: '28 jan. 2026' },
    author: { name: 'Institutional Research', role: { EN: 'Analyst', DE: 'Analyst', FR: 'Analyste' } },
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '10',
    title: { EN: 'Network Governance', DE: 'Netzwerk-Governance', FR: 'Gouvernance Réseau' },
    excerpt: { EN: 'Trustless cooperation between three nodes.', DE: 'Vertrauenslose Kooperation zwischen drei Knoten.', FR: 'Coopération sans confiance entre trois nœuds.' },
    content: {
      EN: `## Algorithmic Trust\n\nThe triangular model works because it is self-enforcing. Escrow protects lenders, seed investors prove product, and providers scale growth. Network effects ensure that the most efficient actors get the cheapest capital. We are democratizing scale through algorithmic governance on the CREDEMA.Finance portal.`,
      DE: `## Algorithmisches Vertrauen\n\nDas Dreiecksmodell funktioniert durch Selbstdurchsetzung. Escrow schützt Geber, Seed-Investoren beweisen das Produkt, Hebelgeber skalieren. Netzwerkeffekte sichern effizienten Akteuren günstiges Kapital. Wir demokratisieren Skalierung durch Governance auf dem CREDEMA.Finance Portal.`,
      FR: `## Confiance Algorithmique\n\nLe modèle triangulaire s'auto-exécute. Le séquestre protège les prêteurs, les investisseurs valident, les fournisseurs scalent. Les effets de réseau garantissent aux meilleurs un capital peu coûteux. Nous démocratisons le passage à l'échelle sur le portail CREDEMA.Finance.`
    },
    category: { EN: 'Protocol', DE: 'Protokoll', FR: 'Protocole' },
    readTime: { EN: '5 min', DE: '5 Min', FR: '5 min' },
    date: { EN: 'Jan 30, 2026', DE: '30. Jan 2026', FR: '30 jan. 2026' },
    author: { name: 'Eric Gaudin', role: { EN: 'Director', DE: 'Direktor', FR: 'Directeur' } },
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070'
  }
];

export const FOUNDATIONS_CHAPTERS: FoundationChapter[] = [
  {
    id: 'tutorial',
    title: { EN: '1. Step-by-Step Portal Tutorial', DE: '1. Schritt-für-Schritt Portal Tutorial', FR: '1. Tutoriel pas à pas' },
    content: [
      {
        subtitle: { EN: 'Step 1: Registration', DE: 'Schritt 1: Registrierung', FR: 'Étape 1 : Inscription' },
        text: { 
          EN: "Click 'Apply for Funding'. Provide company details and contact info.\n\nGoal: Secure your NODE_ID.\nPro-Tip: Use corporate email for instant verification.",
          DE: "Klicken Sie auf „Finanzierung beantragen“. Geben Sie Firmendaten an.\n\nZiel: NODE_ID sichern.\nProfi-Tipp: Nutzen Sie Firmen-E-Mails für sofortige Prüfung.",
          FR: "Cliquez sur « Demander un financement ». Fournissez les détails.\n\nObjectif : Sécuriser votre NODE_ID.\nConseil : Utilisez votre e-mail pro."
        }
      },
      {
        subtitle: { EN: 'Step 2: AI Twin Training', DE: 'Schritt 2: KI-Zwilling Training', FR: 'Étape 2 : Entraînement de l\'IA' },
        text: { 
          EN: "Use the RAG Console to upload pitch decks and unit metrics. Our AI creates a representative for investors.\n\nGoal: Automate Investor Relations.\nPro-Tip: Granular spend data boosts trust scores.",
          DE: "Nutzen Sie die RAG-Konsole für Pitch Decks und Kennzahlen. Die KI vertritt Sie vor Investoren.\n\nZiel: Automatisierung der IR.\nProfi-Tipp: Granulare Daten erhöhen den Vertrauenswert.",
          FR: "Utilisez la console RAG pour vos decks. Notre IA vous représente.\n\nObjectif : Automatiser les relations investisseurs.\nConseil : Les données précises boostent la confiance."
        }
      },
      {
        subtitle: { EN: 'Step 3: Escrow Deposit', DE: 'Schritt 3: Escrow Einlage', FR: 'Étape 3 : Dépôt Séquestre' },
        text: { 
          EN: "Lock 10-20% of your leverage ask in a Multi-Sig Smart Escrow wallet. This proves your conviction.\n\nGoal: Unlock 5x-10x Growth Capital.\nPro-Tip: Verify your wallet early to speed up disbursement.",
          DE: "Sperren Sie 10-20 % der Kreditsumme in ein Multi-Sig Smart Escrow Wallet.\n\nZiel: 5x-10x Wachstumskapital freischalten.\nProfi-Tipp: Wallet früh prüfen für schnellere Auszahlung.",
          FR: "Bloquez 10-20% du levier dans un séquestre Multi-Sig. Cela prouve votre conviction.\n\nObjectif : Débloquer 5x-10x de capital.\nConseil : Vérifiez votre portefeuille tôt."
        }
      },
      {
        subtitle: { EN: 'Step 4: Scale and Monitor', DE: 'Schritt 4: Skalierung & Monitoring', FR: 'Étape 4 : Croissance et Suivi' },
        text: { 
          EN: "Receive funds and scale. Our Oracles monitor ROAS to ensure covenant compliance.\n\nGoal: Aggressive growth with 0% dilution.\nPro-Tip: Monitor your ROAS daily via the dashboard.",
          DE: "Erhalten Sie Mittel und skalieren Sie. Unsere Oracles prüfen den ROAS.\n\nZiel: Aggressives Wachstum ohne Verwässerung.\nProfi-Tipp: Prüfen Sie den ROAS täglich im Dashboard.",
          FR: "Recevez les fonds et croissez. Nos Oracles suivent le ROAS.\n\nObjectif : Croissance sans dilution.\nConseil : Suivez votre ROAS quotidiennement."
        }
      }
    ]
  },
  {
    id: 'disclaimer',
    title: { EN: '2. Agent Status & Legal Disclaimer', DE: '2. Agenten-Status & Rechtlicher Hinweis', FR: '2. Statut d\'Agent et Clause de Non-responsabilité' },
    content: [
      {
        subtitle: { EN: 'Intermediary Role', DE: 'Vermittlerrolle', FR: 'Rôle d\'Intermédiaire' },
        text: { 
          EN: "CREDEMA.Finance acts exclusively as an agent and communication technology provider. We connect funding seekers with lenders and provide the telemetry infrastructure to monitor agreements. CREDEMA.Finance does not take part in the financing itself and assumes no responsibility or liability for agreements made between seekers and lenders.",
          DE: "CREDEMA.Finance agiert ausschließlich als Agent und Technologieanbieter. Wir verbinden Suchende mit Gebern. CREDEMA.Finance beteiligt sich nicht an der Finanzierung selbst und übernimmt keine Verantwortung oder Haftung für Verträge zwischen den Parteien.",
          FR: "CREDEMA.Finance agit exclusivement comme agent et fournisseur technique. Nous connectons chercheurs et prêteurs. CREDEMA.Finance ne participe pas au financement et n'assume aucune responsabilité pour les accords conclus."
        },
        regionalNote: {
          EN: "Users must conduct their own due diligence. All contracts are private agreements between stakeholders.",
          DE: "Nutzer müssen ihre eigene Due Diligence durchführen. Alle Verträge sind private Vereinbarungen.",
          FR: "Les utilisateurs doivent effectuer leur propre audit. Tous les contrats sont des accords privés."
        }
      }
    ]
  }
];

export const SQL_SCHEMA_PREVIEW = `-- 1. USER & ROLE MANAGEMENT
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name VARCHAR(255),
  role VARCHAR(50) CHECK (role IN ('FOUNDER', 'SEED_INVESTOR', 'LEVERAGE_PROVIDER')),
  kyc_status VARCHAR(50) DEFAULT 'PENDING'
);`;

export const SMART_CONTRACT_PSEUDO = `// SOLIDITY SMART CONTRACT`;
