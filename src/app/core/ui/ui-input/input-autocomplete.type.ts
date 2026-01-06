export type InputAutocomplete =
  | 'on' // Enables autofill.
  | 'off' // Disables autofill.
  | 'name' // Full name (first and last name).
  | 'honorific-prefix' // Title (e.g., Mr., Mrs., Dr.).
  | 'given-name' // First name.
  | 'additional-name' // Middle name.
  | 'family-name' // Last name.
  | 'nickname' // Nickname or user handle.
  | 'email' // Email address.
  | 'username' // Username for login.
  | 'new-password' // New password (e.g., for registration).
  | 'current-password' // Current password (e.g., for login).
  | 'one-time-code' // One-time authentication code.
  | 'organization-title' // Job title.
  | 'organization' // Company or organization name.
  | 'street-address' // Full street address.
  | 'address-line1' // Address line 1 (street and number).
  | 'address-line2' // Address line 2 (apartment, suite, unit).
  | 'address-line3' // Additional address line.
  | 'country' // Country name.
  | 'country-name' // Full country name (not code).
  | 'postal-code' // Postal or ZIP code.
  | 'cc-name' // Name on a credit card.
  | 'cc-number' // Credit card number.
  | 'cc-exp' // Credit card expiration date (month/year).
  | 'cc-exp-month' // Credit card expiration month.
  | 'cc-exp-year' // Credit card expiration year.
  | 'cc-csc' // Credit card security code (CVC).
  | 'cc-type' // Credit card type (e.g., Visa, MasterCard).
  | 'tel' // Telephone number.
  | 'tel-country-code' // Country code for telephone number.
  | 'tel-national' // National telephone number (no country code).
  | 'tel-area-code' // Telephone area code.
  | 'bday' // Full birthdate (YYYY-MM-DD).
  | 'bday-day' // Day of birth (DD).
  | 'bday-month' // Month of birth (MM).
  | 'bday-year' // Year of birth (YYYY).
  | 'sex' // Gender identity.
  | 'url' // Home page or personal website URL.
  | 'photo'; // URL of the user's profile picture.
