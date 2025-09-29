// GET /api/test-db
export const onRequestGet = async ({ env }) => {
  // consulta muy simple
  const { results } = await env.DB.prepare('SELECT "ok" AS status').all();
  return Response.json(results);
};
