import {NextRequest, NextResponse} from 'next/server';
import cors from 'cors';

// Initialize the CORS middleware.
const corsMw = cors({
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
});


/**
 * The middleware function is used to run the CORS middleware.
 * @param {NextRequest} req The request object.
 * @param {NextResponse} res The response object.
 * @param {Function} fn The function to run.
 * @return {Promise} The promise object.
*/
function runMiddleware(req: NextRequest, res: NextResponse, fn: Function) {
  const resWithHeader = {
    ...res,
    setHeader: (name: string, value: string) => {
      res.headers.set(name, value);
    },
  };

  return new Promise((resolve, reject) => {
    fn(req, resWithHeader, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
}

/**
 * The middleware function is used to run the CORS middleware.
 * @param {NextRequest} request The request object.
 */
export async function middleware(request: NextRequest) {
  await runMiddleware(request, new NextResponse(), corsMw);
  // Continue to the next middleware/route handler
  return NextResponse.next();
}
