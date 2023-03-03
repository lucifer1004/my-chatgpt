# My ChatGPT 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flucifer1004%2Fmy-chatgpt&env=OPENAI_API_KEY&envDescription=You%20need%20to%20generate%20an%20OpenAI%20API%20key%20to%20use%20this%20project&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys&project-name=my-chatgpt&repository-name=my-chatgpt&skippable-integrations=1)

<img width="1906" alt="Screenshot" src="https://user-images.githubusercontent.com/13583761/222665780-802f8579-5958-47c2-b138-9ec2bf9c07ea.png">

## Setup

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
