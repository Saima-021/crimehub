import axios from "axios";

export const detectSpamEmail = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ status: "warning", message: "Content is required" });
    }

    const text = content.toLowerCase();

    // 1. Email Pattern Check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(content)) {
      return res.json({
        status: "success",
        message: "NOT_SPAM",
        data: { classification: "NOT_SPAM", score: 5, reason: "Input is just an email" }
      });
    }

    // 2. Expanded Suspicious Domains (Phishing/Malware)
    const suspiciousDomains = [
      "free-money", "lottery", "winner", "claim-prize", "verify-account", "bank-update", 
      "login-secure", "update-info", "secure-vault", "crypto-bonus", "bit-gain", "giftcard-free", 
      "netflix-payment", "amazon-reward", "paypal-dispute", "unusual-activity", "account-freeze", 
      "refund-tax", "gov-subsidy", "re-validate", "win-iphone", "secure-login", "account-verify",
      "bit-hourly", "cloud-mine", "hash-profit", "wallet-connect", "dapp-fix", "pancakeswap-fix"
    ];

    if (suspiciousDomains.some(domain => text.includes(domain))) {
      return res.json({
        status: "danger",
        message: "SPAM",
        data: { classification: "SPAM", score: 95, reason: "Phishing domain detected" }
      });
    }

    // 3. The "Mega List" of Spam Keywords (Categorized)
    const spamKeywords = [
      // --- Financial & Banking Fraud ---
      "inheritance", "wire transfer", "offshore", "tax refund", "low interest", "debt relief", 
      "overdue", "unauthorized login", "security breach", "payout", "pre-approved", "atm card",
      "consignment", "bank draft", "beneficiary", "swift code", "unpaid invoice", "billing error",
      "account suspended", "verify your ssn", "credit score", "loan approval", "mortgage rate",

      // --- Crypto & Web3 Scams ---
      "seed phrase", "private key", "airdrop", "moonshot", "elon musk giveaway", "wallet sync",
      "trust wallet", "metamask login", "decentralized profit", "staking bonus", "eth giveaway",
      "bitcoin doubled", "crypto mining", "binance support", "nft whitelist", "presale live",

      // --- Job & "Work from Home" Scams ---
      "hiring immediately", "no experience", "daily payout", "remote task", "salary $", "part time job",
      "whatsapp job", "telegram task", "data entry job", "work from home", "easy money", "commission based",
      "earn extra income", "flexible hours", "online recruiter", "hr manager",

      // --- Prize, Lottery & Gifts ---
      "lottery", "winner", "claim prize", "congratulations", "lucky draw", "gift card", "iphone 15",
      "reward points", "voucher", "selected winner", "draw number", "mystery box", "promotional code",
      "exclusive deal", "100% free", "no cost", "instant win",

      // --- Adult, Pharma & Gambling ---
      "viagra", "cialis", "weight loss", "miracle cure", "singles in your area", "dating site",
      "casino", "betting", "poker", "jackpot", "free spins", "pharmacy", "cheap meds", "testosterone",

      // --- Urgency & Social Engineering ---
      "act now", "urgent", "final warning", "immediate response", "legal action", "court notice",
      "police report", "don't delete", "confidential", "top secret", "access denied", "re-activate",
      "expired subscription", "membership renewal", "cancel auto-pay",

      // --- General Marketing/Junk ---
      "click here", "unsubscribe", "opt-out", "newsletter", "limited time", "one-time offer",
      "save 90%", "guaranteed", "lowest price", "wholesale", "certified", "best price",
      "increase traffic", "seo optimization", "email marketing", "bulk lead",
      // --- Currency & Prize Scams (Added for your specific case) ---
  "won rs", "won inr", "won $", "cash prize", "credited to your account",
  "rs 1000", "rs 5000", "rs 10000", "lottery winner", "lucky draw winner",
  "won ₹", "receive ₹", "claim ₹", "amount credited",

  // --- Financial & Banking Fraud ---
  "inheritance", "wire transfer", "offshore", "tax refund", "low interest", "debt relief", 
  "overdue", "unauthorized login", "security breach", "payout", "pre-approved", "atm card",
  "beneficiary", "unpaid invoice", "billing error", "account suspended",

  // --- Crypto & Web3 Scams ---
  "seed phrase", "private key", "airdrop", "moonshot", "wallet sync", "metamask login",
  "bitcoin doubled", "crypto mining", "binance support", "nft whitelist",

  // --- Job & "Work from Home" Scams ---
  "hiring immediately", "no experience", "daily payout", "remote task", "salary $", 
  "whatsapp job", "telegram task", "data entry job", "work from home", "easy money",

  // --- Urgency & Social Engineering ---
  "act now", "urgent", "final warning", "immediate response", "legal action", 
  "police report", "membership renewal", "cancel auto-pay"
    ];

    if (spamKeywords.some(word => text.includes(word))) {
      return res.json({
        status: "danger",
        message: "SPAM",
        data: { classification: "SPAM", score: 88, reason: "Keyword match" }
      });
    }

    // 4. TinyLlama AI Check (Remains Unchanged)
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "tinyllama",
      prompt: `Classify as SPAM or NOT_SPAM. JSON ONLY. {"classification": "...", "score": 0, "reason": "..."} Content: ${content}`,
      stream: false,
      options: { temperature: 0, num_predict: 60 }
    });

    const output = response.data.response.trim();
    let parsed = null;
    try {
      const match = output.match(/\{[\s\S]*?\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch { parsed = null; }

    if (!parsed) {
      parsed = { classification: "NOT_SPAM", score: 20, reason: "Clear" };
    }

    return res.json({
      status: parsed.classification === "SPAM" ? "danger" : "success",
      message: parsed.classification,
      aiNotice: "AI response can be wrong",
      data: parsed
    });

  } catch (error) {
    console.error("Spam detection error:", error.message);
    return res.status(500).json({ status: "danger", message: "Detection failed" });
  }
};