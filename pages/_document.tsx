import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className="h-full">
        <Head>
          {process.env.NODE_ENV === "development" ? (
            <>
              <script defer src="//cdn.jsdelivr.net/npm/eruda"></script>
              <script defer src="/eruda.js"></script>
            </>
          ) : null}

          <link rel="icon" href="/dog.png" />
        </Head>
        <body className="h-full overflow-hidden bg-gray-100 dark:bg-slate-700">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
