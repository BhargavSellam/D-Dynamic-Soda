# D Dynamic Soda website

Editable company and product content lives in `src/content.ts`.

## Enquiry email setup

The server endpoint validates submissions, uses a honeypot and timing check for spam, rate limits by IP, and only confirms success after the email provider accepts the message.

Copy `.env.example` to `.env` and add server-side values for:

- `RESEND_API_KEY`
- `BUSINESS_EMAIL`
- `ENQUIRY_FROM_EMAIL` (must use a domain verified with Resend)

Do not prefix these variables with `VITE_`; that would expose them to browser code. When the values are absent, the form returns an honest configuration error and keeps the visitor’s entered details.

The local endpoint is mounted by Vite at `POST /api/enquiries`. For a separate production host, deploy `server/enquiry.ts` through the host’s Node/serverless adapter and keep the same route.
