# Crypto Rewards Earnings Calculator

Enter coins held, an assumed reward rate, fees and duration to estimate potential rewards. The page always reminds the user that reward rates and coin prices can change.

**Live demo:** https://your-project.vercel.app  <!-- replace with your Vercel link -->
**GitHub:** [https://github.com/your-username/crypto-rewards-earnings-calculator](https://github.com/TirthDoshi2184/Crypto_Reward_Earning_Calculator)  <!-- replace -->

![Screenshot of the Crypto Rewards Earnings Calculator](docs/screenshot.png)
<!-- Take a screenshot of the deployed app, save it as docs/screenshot.png -->

Built with React + Vite. Everything runs in the browser. There is no backend and no API, and the coin price is typed in by the user so the app never depends on live data.

## Features
- Coins held, yearly reward rate, duration (days / months / years), optional fee and optional coin price
- Currency selector: INR, USD, EUR, GBP
- Rewards before fee, fee, rewards you keep, and the coins you would have afterwards
- Bar chart showing how rewards build up over the duration
- Always-visible notice that reward rates and coin prices can change
- Reset button to clear all inputs
- Responsive layout for phones and desktops

## Run locally
```bash
npm install
npm run dev
```

## Build and deploy
```bash
npm run build
```
On Vercel: import the GitHub repo, keep the detected **Vite** preset (build command `npm run build`, output directory `dist`) and deploy.

## How the maths works (simple rewards, no compounding)
- Years = duration converted to years (days ÷ 365, months ÷ 12)
- Rewards before fee = coins × (rate / 100) × years
- Fee = rewards before fee × (fee % / 100)
- Rewards you keep = rewards before fee − fee
- Money value (if a price is entered) = rewards you keep × coin price

## Test cases (worked out by hand)
| Coins | Rate / year | Duration | Fee | Rewards before fee | Fee amount | Rewards you keep | Coins after |
|---|---|---|---|---|---|---|---|
| 10 | 5% | 12 months | 10% | 0.5 | 0.05 | 0.45 | 10.45 |
| 100 | 8% | 6 months | 0% | 4 | 0 | 4 | 104 |
| 2 | 10% | 180 days | 20% | 0.09863 | 0.01973 | 0.07890 | 2.07890 |

With a coin price of 100,000, the first case is worth 0.45 × 100,000 = 45,000.

Invalid input (0 coins, negative rate, fee above 100%) shows an error message instead of a result.

## Structure
```
public/favicon.svg
src/
  App.jsx                    inputs, validation, calculation, result
  components/Field.jsx       input with unit label
  components/GrowthBars.jsx  rewards-over-time bars
  utils/format.js            currency and number formatting
  styles.css
```
