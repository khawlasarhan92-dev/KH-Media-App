Mailtrap testing instructions
=============================

This project uses a simple SMTP configuration to send emails. For portfolio/demos we recommend using Mailtrap so messages are captured and not delivered to real users.

1) Setup
---------
- Create a Mailtrap sandbox and copy the SMTP credentials (Host, Port, Username, Password).
- Edit `backend/.env` and set the following values (replace with your Mailtrap values):

```
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<your-mailtrap-username>
SMTP_PASS=<your-mailtrap-password>
EMAIL=you@yourproject.test
SEND_EMAILS=true
EMAIL_MAX_RETRIES=2
```

2) Quick test (sendTestEmail)
------------------------------
- From the `backend` directory run:

```powershell
node .\sendTestEmail.js
```

- Open Mailtrap inbox to see the captured message.

3) Test signup flow
--------------------
- Start the API server (if not running):

```powershell
node .\server.js
```

- Send a POST request to the signup endpoint (example using PowerShell curl):

```powershell
curl -Method POST -Uri http://localhost:8000/api/v1/auth/signup -Headers @{ "Content-Type" = "application/json" } -Body (@{
  username = "demo-user"
  email = "tester@example.com"
  password = "Testing123!"
  passwordConfirm = "Testing123!"
} | ConvertTo-Json)
```

- Check Mailtrap inbox for the OTP email.

4) Debugging
------------
- Check logs in `backend/logs/email.log` for attempts and errors:

```powershell
Get-Content .\logs\email.log -Tail 200
```

5) Notes
--------
- Keep `.env` out of version control. Add `.env` to `.gitignore`.
- To disable sending mails (demo mode) set `SEND_EMAILS=false`.
