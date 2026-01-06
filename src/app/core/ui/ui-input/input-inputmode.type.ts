export type InputMode =
  | 'none' // No virtual keyboard should be displayed.
  | 'text' // Standard text input.
  | 'decimal' // Numeric input with a decimal point.
  | 'numeric' // Numeric input only.
  | 'tel' // Telephone keypad input.
  | 'search' // Input optimized for search.
  | 'email' // Input optimized for email addresses.
  | 'url'; // Input optimized for URLs.
