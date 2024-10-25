export default async function (req, res) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const input = req.body.input || "";
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model:
        process.env.OPENAI_IMAGE_MODEL_NAME ??
        "stabilityai/stable-diffusion-3-5-large",
      prompt: req.body.input || "",
      negative_prompt: "low quality, low resolution, watermark",
      image_size: "768x512",
      batch_size: 1,
      num_inference_steps: 50,
      guidance_scale: 10,
    }),
  };

  try {
    const result = await fetch(
      `${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/images/generations`,
      options,
    ).then((res) => res.json());

    // Comment them out if you do not need logging
    console.info(input);
    console.info(options);
    console.info(result);
    res.status(200).json(result);
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
