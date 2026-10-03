# U.S. individual giving setup

Status (3 October 2026): Review the donation design with Patima before choosing or activating a provider. The GlobalGiving interest survey remains an unsubmitted draft. Patima Tungpuchayakul is the proposed contact (`patimalpn2012@gmail.com`, as published on LPN's website).

The interactive design now replaces the main donation page at `/en/donate` and `/th/donate` in local development. The previous `/donate/preview` routes redirect to the main page in the same language. It proposes two channels: Thailand (THB, PromptPay QR or foundation bank transfer), and international (hosted partner checkout, illustrative USD amounts and one-time/monthly options). All payment controls are previews. Bank details, QR, receipt eligibility, provider, fees, currencies and recurring support require LPN confirmation. The expandable review section on the page contains the decisions for Patima. The page retains its review banner and expandable decisions for Patima; this is still a payment prototype awaiting review.

## GlobalGiving path, if selected after review

1. Complete the [Pathway interest survey](https://globalgiving.typeform.com/path2gg-survey). The live survey says the next invitation round is expected in early 2027; an invitation is not guaranteed.
2. If invited, complete GlobalGiving's fundraising workbook and due diligence. For a Thai nonprofit, assemble the [documents GlobalGiving lists](https://support.globalgiving.org/hc/en-us/articles/360026454991-What-do-I-need-for-the-application): registration certificate; adopted founding document with a dissolution clause or applicable Thai law; two years of financial statements and the current budget; program materials; a recent independent reference letter; senior staff/board names; and an organization bank account. Prepare English translations if the originals are in Thai. LPN's authorized officer must review any terms and certifications.
3. After approval, publish a GlobalGiving project for LPN's current work. Use a concrete, accurately budgeted purpose. Do not imply that a particular gift guarantees a rescue or individual outcome. Test the checkout, receipt, mobile flow, and a small live donation with LPN staff before sharing it publicly.
4. In Payload Admin → Site → Footer, set `globalGivingProjectUrl` to the **live LPN project URL**, then set `globalGivingVerifiedAt` and `globalGivingVerifiedBy`. These verification fields remain available in Payload. Before activating the new donation flow, connect it to the verified fields and validate that the destination is an HTTPS `globalgiving.org/projects/…` page. The current design does not initiate payments or read these fields.
5. Make one final public URL for the roadshow after the new domain is live, then create and print its QR code. Use the LPN website's `/en/donate` page as the durable QR destination so the provider can change without reprinting. Verify that page and the provider link on a phone before printing.

## Current donor experience

In local development, `/en/donate` and `/th/donate` present the two-channel design for review. Donors can try illustrative amount, frequency, and payment-method choices and see a preview of the next step. No payment is taken, no real bank account or scannable payment QR is displayed, and no external checkout is opened. The page also links to LPN contact for partnership discussions. Confirm all payment details and connect the verified Payload fields before activating payments.

Do not promise U.S. tax deductibility for a direct gift to LPN. Once GlobalGiving is live, refer donors to the provider's checkout and receipt terms for their particular gift. The [Pathway overview](https://support.globalgiving.org/hc/en-us/articles/39772852954132-How-can-a-nonprofit-join-GlobalGiving) describes the invitation process and explicitly says the interest survey is not the due-diligence application.

## Open organization details

- Confirm the Thai legal name exactly as it appears on the registration certificate.
- Confirm the latest annual operating budget range in USD for the interest survey.
- Have LPN's authorized officer collect the due-diligence documents above and decide who will approve the project narrative, donor receipts, and public payment link.
