# Malik AI

## Deployment (free tier)
1. Upload this folder's files to a GitHub repository.
2. Create a **Web Service** on Render and connect that repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Choose the **Free** plan.
6. In Render → Environment, add:
   - `GEMINI_API_KEY` = your Gemini API key
   - `ACCESS_CODE` = a private login code you share with your friends
   - `GEMINI_MODEL` = `gemini-2.5-flash` (optional)
7. Deploy. Render will provide a public `onrender.com` URL.

Do not put your API key in the HTML or share it with friends. Free hosting may sleep when idle; the first request can take about a minute. Gemini API availability and free quotas depend on Google's current terms and account eligibility.
