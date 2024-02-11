export const configuration = () => {
  return {
    openaiSecret: process.env.OPENAI_SECRET as string,
  };
};
