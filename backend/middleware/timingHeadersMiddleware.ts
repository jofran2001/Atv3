import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para adicionar headers de timing na resposta
 * Permite que o cliente (frontend) meça sua própria latência
 * 
 * Headers adicionados:
 * - X-Response-Time: Tempo total de processamento no servidor (ms)
 * - X-Server-Processing-Time: Tempo de processamento da lógica (ms)
 * - X-Server-Response-Time: Tempo para enviar dados ao cliente (ms)
 * - X-Request-Received-At: Timestamp de quando a requisição chegou
 */
export function timingHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestStartTime = Date.now();
  const requestStartHrTime = process.hrtime();
  
  // Adiciona timestamp de recebimento
  res.setHeader('X-Request-Received-At', requestStartTime.toString());
  
  // Intercepta o envio da resposta
  const originalEnd = res.end;
  let responseStartTime: [number, number] | null = null;
  
  res.end = function(...args: any[]): any {
    responseStartTime = process.hrtime();
    
    // Calcula tempos
    const totalTime = calculateTime(requestStartHrTime, responseStartTime);
    
    // Adiciona headers de timing
    res.setHeader('X-Response-Time', `${totalTime.toFixed(2)}ms`);
    res.setHeader('X-Server-Timestamp', Date.now().toString());
    
    return originalEnd.apply(res, args as any);
  };
  
  next();
}

/**
 * Calcula o tempo decorrido entre dois momentos
 */
function calculateTime(start: [number, number], end: [number, number]): number {
  const diff = process.hrtime(start);
  return (diff[0] * 1000) + (diff[1] / 1_000_000);
}
