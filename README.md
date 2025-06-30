# Project of a Financial Management SaaS - Finance Control EWD

## SaaS for Production

### Immersion course - Full Stack Week

Taught by Felipe Rocha - Software Engineer and Teacher at Full Stack Club.
<br>

Below is the result of the completed project:
<br>

### 🎯 Objective:

> - Develop a full stack application to consolidate the fundamentals learned during the Full Stack Week immersion - building a financial management SaaS called **_`Finance Control EWD`_**. The project implements a robust backend with server actions (simplifying client-server interaction, especially for handling form submissions and data mutations) , a [Next.js](https://nextjs.org/) frontend with a responsive UI, and a [Prisma](https://www.prisma.io/) ORM integrated with a [PostgreSQL](https://www.postgresql.org/) database hosted on [Neon](https://neon.tech/). The application leverages the composition pattern for modular development and includes advanced features like AI-generated reports in PDF format, optimized integrations, and extensive subcategories for detailed financial tracking ✅.

> - This project solidified my skills in full-stack development, including server-side rendering, API consumption, and database management with Prisma and PostgreSQL. A key highlight was integrating [OpenAI](https://openai.com/) for AI-driven insights, [Stripe](https://stripe.com/br) and [Clerk](https://clerk.com/) with [Upstash](https://upstash.com/) for optimized subscription handling, and implementing a [Cloudflare tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) for testing.🔗

> - The modular structure and _responsive design_ made the development process both efficient and enjoyable
>   > - The project adopts a _monolithic architecture_ to streamline initial development, consolidating backend and frontend logic within a single application, with potential for future microservices evolution.✅<br>

> - The introduction of over 100 subcategories enhances user options, enabling more precise financial categorization and enriching the generated reports with detailed analysis.<br>

### 📌 Motivation

Finance Control EWD was born from the need for simple, direct and accessible financial control. Unlike other applications on the market, it prioritizes the user experience, with minimal synchronization, ensuring performance and privacy even on devices with few resources.

### 🧩 Features

- Transaction management with full CRUD operations
- AI-generated financial reports with option to print to PDF with custom formatting
- Subscription plans (monthly and new semestral option) with transaction limits and history visibility
- Secure authentication with Clerk and encrypted payment processing with Stripe
- Responsive UI across all screen sizes and orientations, including a new layout for smaller screens
- Custom logo and login banner design
- Dashboard with charts, progress bars, and subtle card animations
- Integration with Stripe for payments and Clerk for authentication, optimized with Upstash and Redis fallback
- Deletion of transactions with confirmation dialogs
- Loader implementation for better user experience
- Timeout handling for server actions
<br>
<p align="center">
<img src="public\github\Model.png" alt="print-screen-image" width="800px" >
</p>
<table align="center">
  <tr>
    <td>
      <img alt="page-gif" width="450px" src="public\github\readme_gif_1.gif">
    </td>
    <td>
      <img alt="page-gif" width="450px" src="public\github\readme_gif_2.gif">
    </td>
  </tr>
</table>
<table align="center">
  <tr>
    <td>
      <img alt="page-gif" width="450px" src="public\github\readme_gif_3.gif">
    </td>
    <td>
      <img alt="page-gif" width="450px" src="public\github\readme_gif_4.gif">
    </td>
  </tr>
</table>
<br>
<br>
<div align="center">

Click here to try it out .. thanks for your interest!  
( 🖱️ Ctrl + click to open in a new tab or visit [www.financecontrol-ewd.com.br](https://www.financecontrol-ewd.com.br) ).

</div>
 <br>
 <br>

### Adjustments and improvements

The project was fully completed and some of the resources used were:

- [x] **Frontend**:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Next.js](https://img.shields.io/badge/-Next.js-333333?style=flat&logo=Next.js&logoColor=000000)](https://nextjs.org/)&nbsp;&nbsp;[![React](https://img.shields.io/badge/-React-333333?style=flat&logo=react)](https://reactjs.org)&nbsp;&nbsp;[![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-333333?style=flat&logo=Tailwind-CSS&logoColor=38B2AC)](https://tailwindcss.com/)&nbsp;&nbsp;[![Shadcn UI](https://img.shields.io/badge/-Shadcn_UI-333333?style=flat&logo=shadcnui)](https://ui.shadcn.com/)

- [x] **Backend & Database**:&nbsp;&nbsp;&nbsp;[![Node.js](https://img.shields.io/badge/-Node.js-333333?style=flat&logo=Node.js)](https://nodejs.org)&nbsp;&nbsp;[![Zod](https://custom-icon-badges.demolab.com/badge/-Zod-333333?style=flat&logo=lock&logoColor=3E67B1)](https://zod.dev/)&nbsp;&nbsp;[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-333333?style=flat&logo=PostgreSQL)](https://www.postgresql.org/)&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/ed-radanovis/Soft-App-Memes-Machine-DIO-11-2022/6c046ddb9cd516f3cea41a8abbb1318fc3e6d8d1/assets/github/mini_logo_neondb.png" width="21px" alt="Neon Icon">[![Neon](https://img.shields.io/badge/-Neon-333333?style=flat&logo=neon&logoColor=00E599)](https://neon.tech/)&nbsp;&nbsp;[![Prisma](https://img.shields.io/badge/-Prisma-333333?style=flat&logo=Prisma&logoColor=3982CE)](https://www.prisma.io/)

- [x] **Authentication & Payments**:&nbsp;&nbsp;&nbsp;[![Clerk](https://img.shields.io/badge/-Clerk-333333?style=flat&logo=Clerk&logoColor=6E45E2)](https://clerk.com/)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Stripe](https://custom-icon-badges.demolab.com/badge/-Stripe-333333?style=flat&logo=stripe&logoColor=008CDD)](https://stripe.com/)

- [x] **AI & Reporting**:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![OpenAI](https://custom-icon-badges.demolab.com/badge/-OpenAI-333333?style=flat&logo=openai&logoColor=ffffff)](https://platform.openai.com)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![React Markdown](https://custom-icon-badges.demolab.com/badge/-React%20Markdown-333333?style=flat&logo=react&logoColor=ffffff)](https://github.com/remarkjs/react-markdown)

- [x] **Optimization & Utilities**:&nbsp;&nbsp;&nbsp; [![Upstash](https://custom-icon-badges.demolab.com/badge/-Upstash-333333?style=flat&logo=upstash&logoColor=00E9A3)](https://upstash.com/)&nbsp;&nbsp;[![Cloudflare](https://img.shields.io/badge/-Cloudflare-333333?style=flat&logo=cloudflare)](https://www.cloudflare.com)

- [x] **Testing& Linting**:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🐶[![Husky](https://img.shields.io/badge/-Husky-333333?style=flat&logo=husky)](https://typicode.github.io/husky/#/)&nbsp;&nbsp;[![Git Commit Msg Linter](https://img.shields.io/badge/-Git%20Commit%20Msg%20Linter-333333?style=flat)](https://www.npmjs.com/package/git-commit-msg-linter)&nbsp;&nbsp;[![lint-staged](https://img.shields.io/badge/lint-staged-333333?style=flat)](https://www.npmjs.com/package/lint-staged)

- [x] **Hosting and Deployment**:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Render](https://img.shields.io/badge/-Render-333333?style=flat&logo=render&logoColor=8a05ff)](https://render.com)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Netlify](https://img.shields.io/badge/-Netlify-333333?style=flat&logo=netlify)](https://netlify.com)

- [x] **Development Tools & Design**:&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/ed-radanovis/Soft-App-Memes-Machine-DIO-11-2022/6c046ddb9cd516f3cea41a8abbb1318fc3e6d8d1/assets/github/mini_logo_vscode.png" width="21px" alt="VS Code Icon">[![Visual Studio Code](https://img.shields.io/badge/-Visual_Studio_Code-333333?style=flat&logo=visual-studio-code&logoColor=007ACC)](https://code.visualstudio.com/)&nbsp;&nbsp;[![Figma](https://img.shields.io/badge/-Figma-333333?style=flat&logo=figma&logoColor=007ACC)](https://figma.com/)&nbsp;&nbsp;[![Eraser AI](https://custom-icon-badges.demolab.com/badge/-Eraser%20AI-333333?style=flat&logo=eraser&logoColor=ffffff)](https://eraser.ai)
      <br>

#### ⚙️ Steps for the project

✔️ - Planning: Access the Figma design to review project planning. Documentation was enhanced using Eraser AI for technical design. <br>
✔️ - Configure the environment:

- [x] Install `Node.js` (version >=16).
- [ ] If you choose, clone the repository:

```bash
git clone https://github.com/ed-radanovis/Finance_Control_EWD_FullStackWeek.git
```

- [ ] Navigate to the project folder: `cd finance-control-EWD` or the folder you created and named.

---

#### 💻 Backend

✔️ - Initialize the project with Next.js:

```bash
npx create-next-app@latest --ts
npm run dev
```

- [x] &nbsp;&nbsp;&nbsp;Additional Commands:
  - [ ] &nbsp;&nbsp;&nbsp; After `npm run dev`, access `localhost:3000` in the browser to confirm that the server is running correctly.

<br>

> 📝 Note: Implement server actions, server components, and the composition pattern for modular development. The project adopts a _monolithic architecture_ to streamline initial development, consolidating backend and frontend logic within a single application.

---

#### 💾 Database

✔️ - Set up Prisma and PostgreSQL:<br>

- [x] &nbsp;&nbsp;&nbsp; Install Prisma: `npm install prisma@latest @prisma/client@latest`
- [x] &nbsp;&nbsp;&nbsp;Initialize Prisma: `npx prisma init`
- [x] &nbsp;&nbsp;&nbsp;Format Prisma schema: `npx prisma format` (ensures schema readability)
- [x] &nbsp;&nbsp;&nbsp;Configure `DATABASE_URL=`"postgresql://neondb_owner:`<your-password>`@exx-square-xxxxxxx-a6h2vkqr.us-east-0.aws.neon.tech/FinanceControlEWD?sslmode=require" (replace `<your-password>` with your Neon DB password)
- [x] &nbsp;&nbsp;&nbsp;Run migration: `npx prisma migrate dev --name init_db`
- [x] &nbsp;&nbsp;&nbsp;Access Prisma Studio: `npx prisma studio` (available at `http://localhost:5555/`)

✔️ - Configure the environment variables:&nbsp;&nbsp;&nbsp;&nbsp;🔐

> ℹ️ An example environment file is available at: `.env.example`. Use it to create your `.env` file with sensitive credentials (e.g., database password, API keys for Clerk, Stripe, and OpenAI).

<br>

- [x] &nbsp;&nbsp;&nbsp;Create a `.env` file in the project root:

```bash
  cp .env.example .env
```

- [x] &nbsp;&nbsp;&nbsp;Edit the .env file and insert your credentials (e.g., Neon DB password, Clerk publishable key).

> ⚠️ Important: Do not commit your real **.env** file to version control.
> Instead, use a _`.env.example`_ file to share configuration instructions without exposing sensitive data.<br>

---

#### 🖥️ Frontend

✔️ - Enhance UI with Tailwind CSS and Shadcn/UI components:

- [x] &nbsp;&nbsp;&nbsp;Install Tailwind: Follow <u>Tailwind CSS setup</u>
- [x] &nbsp;&nbsp;&nbsp;Add Prettier Tailwind plugin: Create `.prettierrc.json` with `{"plugins": ["prettier-plugin-tailwindcss"]}`
- [x] &nbsp;&nbsp;&nbsp;Install Shadcn/UI: `npx shadcn@latest init` and add components like **button**, **table**, **dialog**, etc.

✔️ - Add responsiveness, new layouts for smaller screens, subtle animations (hover, click, color transitions), and a loader. .<br>
✔️ - Design custom logo and login banner. <br>

---

#### 🔗 Integration

✔️ - Authentication with Clerk:

- [x] &nbsp;&nbsp;&nbsp;Install: `npm install @clerk/nextjs@latest`
- [x] &nbsp;&nbsp;&nbsp;Configure environment variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- [x] &nbsp;&nbsp;&nbsp;Create `middleware.ts` and add **ClerkProvider** in `layout.tsx`.

✔️ - Payments with Stripe:

- [x] &nbsp;&nbsp;&nbsp;Install: npm install stripe@latest @stripe/stripe-js@latest
- [x] &nbsp;&nbsp;&nbsp;Configure environment variables:

```bash
STRIPE_PREMIUM_PLAN_PRICE_ID:
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL
```

- [x] &nbsp;&nbsp;&nbsp;Set up webhook in `app/api/webhooks/stripe/route.ts` and test with **stripe listen**.

✔️ - Optimize Stripe and Clerk integration with Upstash Redis:

- [x] &nbsp;&nbsp;&nbsp;Install: `npm install bull @types/bull`
- [x] &nbsp;&nbsp;&nbsp;Configure `REDIS_URL` and implement a fallback using global state to handle _Redis free tier_ limitations.

---

#### 🔬 Enhancements

✔️ - **AI Integration:** Added OpenAI `(npm i openai@latest)` for report generation with over **100 subcategories**, improving report granularity. Reports are exported as formatted PDFs.<br>
✔️ - **Timeout Handling:** Implemented timeouts for server actions to enhance reliability.<br>
✔️ - **Subscription Plans:** Added a semestral plan and adjusted limits (e.g., transaction quotas, basic plan history visibility).<br>
✔️ - **Testing & Linting:** Set up Husky, Lint-Staged, and Git Commit Msg Linter for conventional commits.<br>
✔️ - **Cloudflare Tunnel:** Used for testing before deploying (e.g. https://x-apparent-virtue-suggestion.trycloudflare.com).

---

#### 🌐 Deploy:

✔️ - Deploy on Vercel (Recommended - Free Tier):

- [x] Go to [Vercel](https://vercel.com).
      Click **New Project**, then import the Git repository `https://github.com/repository-created-by-you`.
  - [x] Configure environment variables in Vercel:
  - `DATABASE_URL="postgresql://neondb_owner:<your-password>@exx-square-xxxxxxx-a6h2vkqr.us-east-0.aws.neon.tech/FinanceControlEWD?sslmode=require"` (replace `<your-password>` with your Neon DB password)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>` (from Clerk dashboard)
  - `CLERK_SECRET_KEY=<your-clerk-secret>` (from Clerk dashboard)
  - `STRIPE_PREMIUM_PLAN_PRICE_ID=<your-stripe-price-id>` (premium plan price ID from Stripe)
  - `STRIPE_SEMESTRAL_PLAN_PRICE_ID=<your-stripe-price-id>` (semestral plan price ID from Stripe)
  - `STRIPE_SECRET_KEY=<your-stripe-secret-key>` (from Stripe dashboard)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>` (from Stripe dashboard)
  - `STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>` (from Stripe Webhooks in live mode)
  - `NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL=<your-stripe-customer-portal-url>` (from Stripe Billing in live mode)
  - `REDIS_URL=<your-redis-url>` (from Upstash, if used)
  - `# OPENAI_API_KEY=<your-openai-key>` (optional, uncomment and add from OpenAI platform if needed)
- [x] Set the build command: `npm run build` (Vercel auto-detects Next.js defaults).
- [x] Set the start command: `npm run start` (Vercel auto-detects Next.js defaults).
- [x] Deploy and access the generated URL (e.g., `https://<your-domain>.vercel.app` or your custom domain after configuration).

❓ - Optional Deploy on Render (Free Tier):

- [ ] Go to [Render](https://render.com).
- [ ] Create a new web service, connect the repository `https://github.com/repository-created-by-you`.
- [ ] Configure environment variables in Render (same as above for Vercel).
- [ ] Set the build command: `npm run build`.
- [ ] Set the start command: `npm run start` (or adjust to `next start -p $PORT` if required).
- [ ] Deploy and access the generated URL (e.g., `https://<your-domain>.onrender.com`).

> 📝 Note: Ensure your `.env` file is not committed to the repository. Use `.env.example` to share variable names (e.g., `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`). Deployment may require adjusting the start script in `package.json` to `next start -p $PORT` if Render requires a specific port. Test the deployed app and verify API routes (e.g., `/api/transactions`) are accessible.
> <br>

<h4 align="center">
  👤 Developed by 
<h4/>
<table align="center"
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/edmar-radanovis-0130b611a/">
        <img src="public\github\Logo_EWD_APEX.png" width="120px;"height="120px;" alt="Logo da EWD Apex"/><br>
      <sub>
        <b>Edmar Radanovis</b>
      </sub>
      </a>
    </td>
  </tr>
</table>
<br>

<h4 align="center">
  🤝🏻 Collaborators   
<h4/>
<table align="center"
  <tr>
    <td align="center">
      <a href="https://www.youtube.com/@dicasparadevs">
        <img src="public\github\logo_FullStackClub.png" width="320px;" height="80px;" alt="Logo Full Stack Club"/><br>
      <sub>
        <b>Felipe Rocha • Full Stack Club</b>
      </sub>
      </a>
    </td>
  </tr>
</table>
<br>

<h4 align="center">
  🥇 Certificates
<h4/>
<table align="center">
  <tr>
    <td align="center">
      <img src="public\github\certificado.png" width="280px;" height="180px;" alt="Certificate"/><br>
    </td>
  </tr>
</table>
<br>

[⬆ Back to top ](#project-of-a-financial-management-saas---finance-control-ewd)
