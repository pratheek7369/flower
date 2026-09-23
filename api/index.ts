// =========================================================================
// VERCEL SERVERLESS FUNCTION ENTRY POINT FOR FRESHFLORA API
// =========================================================================

let appInstance: any = null;

export default async function handler(req: any, res: any) {
  if (!appInstance) {
    try {
      const serverModule = await import('../server/dist/index.js');
      appInstance = serverModule.default || serverModule;
    } catch {
      const serverModule = await import('../server/src/index.js');
      appInstance = serverModule.default || serverModule;
    }
  }
  return appInstance(req, res);
}
