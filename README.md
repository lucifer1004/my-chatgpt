# My ChatGPT 

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flucifer1004%2Fmy-chatgpt&env=OPENAI_API_KEY&envDescription=You%20need%20to%20generate%20an%20OpenAI%20API%20key%20to%20use%20this%20project&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys&project-name=my-chatgpt&repository-name=my-chatgpt&skippable-integrations=1) [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/lucifer1004/my-chatgpt)

<img width="1906" alt="Screenshot" src="https://user-images.githubusercontent.com/13583761/222665780-802f8579-5958-47c2-b138-9ec2bf9c07ea.png">

## Setup

> If you do not want to run a server locally, you can use the `Deploy` button to deploy your chatbot website to Vercel (or Netlify) with a few clicks. After deployment, you can refer to [Vercel](https://vercel.com/docs/concepts/projects/domains/add-a-domain) or [Netlify](https://docs.netlify.com/domains-https/custom-domains/) to add a custom domain.
>
> Known limits of Vercel/Netlify deployment:
>
> - Functions have a time limit of 10 s for Free tier, but the OpenAI API sometimes cannot respond within 10 s. In that case, you would not get the response. You can upgrade to Pro tier to increase the time limit to 60 s, which should be more than enough.
> - Deployments are public to all by default, which means anyone can use your API key if they have your domain name. You can upgrade to Pro tier to add a basic password authentication. For Vercel, you can also choose to use preview (instead of production) deployments only, and enable `Protect Preview Deployments` to allow only your Vercel team members to visit the site.

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd my-chatgpt
   ```

4. Install the requirements

   ```bash
   $ yarn install
   ```
   
   Or if you want to use `npm`
   
   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
6. Add your [API key](https://beta.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ yarn dev
   ```
   
   Or use `npm`
   
   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! For the full context behind this example app, check out the [tutorial](https://beta.openai.com/docs/quickstart).
