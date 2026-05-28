const { ALLOWED_DOMAINS, BLOCKED_DOMAINS } = require('../config/allowedDomains');

const isEducationalEmail = (email) => {
  if (!email) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  if (BLOCKED_DOMAINS.includes(domain)) return false;

  const isAllowed = ALLOWED_DOMAINS.some(
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`)
  );

  if (isAllowed) return true;

  const eduPatterns = ['.edu', '.edu.in', '.ac.in', '.ac.uk', '.edu.au', '.edu.sg'];
  return eduPatterns.some((pattern) => domain.endsWith(pattern));
};

const getDomain = (email) => {
  return email?.split('@')[1]?.toLowerCase() || '';
};

const getCollege = (email) => {
  const domain = getDomain(email);
  const parts = domain.split('.');
  return parts.length >= 2 ? parts[0].toUpperCase() : domain;
};

module.exports = { isEducationalEmail, getDomain, getCollege };
