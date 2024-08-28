export default () => {
  return {
    // baseUrl: process.env.BASE_URL,
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    HASURA_API_URL: process.env.HASURA_API_URL,
    HASURA_ADMIN_SECRET: process.env.HASURA_ADMIN_SECRET,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    DO_SPACES_BUCKET_NAME: process.env.DO_SPACES_BUCKET_NAME,
    DO_SPACES_ACCESS_KEY: process.env.DO_SPACES_ACCESS_KEY,
    DO_SPACES_SECRET_KEY: process.env.DO_SPACES_SECRET_KEY,
  };
};
