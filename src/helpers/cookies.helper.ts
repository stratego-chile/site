export enum CookieConsent {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export const usableCookies = Object.freeze({
  consent: '__Host-accept-cookies',
})
