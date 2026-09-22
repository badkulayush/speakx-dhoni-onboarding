# PRD: First Screen and Onboarding Entry Experiment

**Status:** Draft  
**Owner:** SpeakX Product  
**Primary goal:** Compare three ways of entering onboarding while keeping the downstream onboarding flow consistent.

## 1. Summary

We will test three first-run entry experiences for new users. The **Action sheet** design is the first option, the supplied direct-language design is the second option, and the existing first-screen flow is the control.

After a user selects a language, all variants follow the existing onboarding sequence:

**Language → Meet Sia → English level → Profile → Profession → Reason → Improvement area → Daily time → Coach preference → Ready**

Returning users use the login path and do not enter the new-user onboarding sequence.

## 2. Goals

- Help new users start onboarding with a clear primary action.
- Make the returning-user login path easy to find without competing with onboarding.
- Measure whether a direct language entry improves language selection and onboarding completion.
- Preserve the existing localized questions, options, theme behavior, and Meet Sia screen.

## 3. Non-goals

- Changing the onboarding questions or answer options.
- Changing the login, OTP, payment, or post-order flows.
- Changing the existing language translations or transcreations.
- Adding a new account creation flow.

## 4. Variants

### Variant A — Action sheet (first option)

This is the preferred first design option.

**Entry screen**

- Use the Action sheet first-screen layout.
- Keep the image-led hero and centered hero copy.
- Show `Trusted by 1 crore+ learners` above the headline.
- Primary CTA: `Get started` in orange.
- Secondary CTA: `Already a SpeakX user. Log in?`
- The `Log in?` text is orange.
- Secondary CTA uses a black, borderless background.
- Do not show a duplicate trust line below the CTA.

**Flow**

- `Get started` opens the language screen.
- Selecting a language continues through the remaining onboarding screens.
- After the user completes onboarding, the login screen opens before premium or checkout.

**New-user sequence**

`Action sheet → Language → Meet Sia → Remaining onboarding → Login → Premium/checkout`

**Returning user sequence**

- The secondary login CTA opens the login screen.
- The user enters their mobile number and completes OTP.
- If the install age is **more than 30 days**, the user enters the onboarding flow after login.
- If the install age is **30 days or less**, the user proceeds directly to the premium or checkout page after login.

**Action sheet behavior**

- The hero image remains interactive with swipe, arrows, and pagination dots.
- The three-dot menu opens support options.
- The secondary CTA has a black, borderless background.
- `Log in?` is orange.
- `Trusted by 1 crore+ learners` appears above the hero headline.
- After language selection, the selected light or dark theme applies to onboarding.

### Variant B — Direct language entry (supplied design)

This variant removes the first screen for new users and opens directly on language selection. The supplied image is the visual reference for this option.

**Language screen**

- Question: `What is your native language?`
- Show the language list in the supplied order, beginning with English, Hindi, Tamil, Telugu, Marathi, and Kannada.
- Use the supplied card treatment: white cards, rounded light-gray borders, orange selected border, and green selected check.
- Use the orange progress indicator at the top.
- Keep the disabled Continue state light gray until a language is selected.
- Show the secondary login CTA below Continue:
  - `Already a SpeakX user?`
  - `Log in` in orange.
- The page must scroll when the language list exceeds the viewport.

**Flow**

- A new install opens directly on the language screen.
- The first screen is skipped.
- Selecting a language and tapping Continue starts the onboarding flow.
- Login opens after onboarding, before premium or checkout.

**Returning user sequence**

- The user taps `Log in`.
- The login screen opens.
- The user enters their mobile number and completes OTP.
- If the install age is **more than 30 days**, the user enters onboarding.
- If the install age is **30 days or less**, the user goes directly to premium or checkout.

**Shared behavior**

- The selected theme starts from the language screen.
- The speaker control appears from the language screen onward.
- The language screen has no back button.
- Existing localized questions and options remain unchanged.

### Variant C — Control

The control is the existing first-screen experience used as the baseline.

**Entry screen**

- Keep the existing hero carousel and first-screen layout.
- Primary CTA: `Get started`.
- Secondary CTA: `I already have an account`.
- Keep the existing trust line placement and styling for the control.

**Flow**

- `Get started` opens the language screen.
- The secondary CTA opens the login screen.
- Selecting a language continues to Meet Sia.

## 5. Shared behavior

- The selected experiment variant must remain stable for the same user across sessions.
- New installs are eligible for the experiment.
- New users see login after completing onboarding and before premium or checkout.
- Returning users who choose a login CTA go to login and then OTP.
- The post-OTP destination uses the install-age bucket: `>30 days` goes to onboarding; `≤30 days` goes to premium or checkout.
- Tapping Get started must not open login.
- The language screen starts the selected light or dark theme for the rest of onboarding.
- The speaker control appears on onboarding screens from language selection onward, not on the login screen.
- Back navigation must return to the previous screen in the active flow, except for Variant B's language screen, which has no back button.
- All questions and options use the approved language-specific content. Hinglish keeps the approved Hinglish copy.

## 6. Measurement

Track the following events with a `variant` property (`action_sheet`, `direct_language`, or `control`):

- `first_screen_viewed`
- `get_started_clicked`
- `login_cta_clicked`
- `language_screen_viewed`
- `language_selected`
- `meet_sia_viewed`
- `onboarding_completed`
- `post_onboarding_login_viewed`
- `login_started`
- `otp_completed`
- `premium_checkout_viewed`

### Primary metrics

- Language selection completion rate.
- Onboarding completion rate.
- Login CTA conversion rate for returning users.

### Guardrail metrics

- Login error rate.
- Back navigation rate.
- Time from first screen or language screen to language selection.
- Drop-off before Meet Sia.

## 7. Acceptance criteria

- Each variant renders correctly at the supported phone viewport sizes.
- Variant A is presented first in the variant picker.
- Variant B opens directly on the language screen for new users.
- Variant C remains available as the control.
- All CTA labels and orange emphasis match the specified copy.
- The Action sheet and Login prompt secondary CTAs have black, borderless backgrounds.
- New users reach login after onboarding and before premium or checkout.
- Returning users older than 30 days enter onboarding after OTP; users 30 days old or newer go to premium or checkout.
- The supplied direct-language layout has the orange progress indicator, selected state, disabled Continue state, and bottom login CTA.
- No duplicate trust line appears in Variant A or Variant B.
- Existing onboarding screens after language selection remain unchanged.
- Type checks and the local preview pass before release.

## 8. Open decisions

- Confirm the final traffic split between Action sheet, Direct language, and Control.
- Confirm whether the direct-language variant should include English as a selectable option in every supported locale.
- Confirm the experiment owner and analysis window.
