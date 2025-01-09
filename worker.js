export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      
      const VALID_TOKENS = [
        "b5a67385-e0e8-4638-8c0e-5660c06aab6c",
      ];

      if (request.method === 'POST' && url.pathname === '/record') {
        try {
            const data = await request.json();

            const token = data.token;

            if (!VALID_TOKENS.includes(token)) {
                return new Response(
                    JSON.stringify({ error: 'Invalid token' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                );
            }

            if (!data.type || !data.name || !data.world || !data.role) {
                return new Response(
                    JSON.stringify({ error: 'Missing required fields' }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }

            const query = `
                INSERT INTO Log (Type, Name, World, Role)
                VALUES (?, ?, ?, ?)
            `;

            const result = await env.DB.prepare(query)
                .bind(data.type, data.name, data.world, data.role)
                .run();
            
            return new Response(
                JSON.stringify({ message: 'Success' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
            
        } catch (e) {
            return new Response(
                JSON.stringify({ error: e.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
      }
    },
  };