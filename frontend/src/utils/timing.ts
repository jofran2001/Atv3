/**
 * Utilitário para medir latência de rede e performance de requisições
 */

export interface TimingMetrics {
  // Tempos do cliente
  clientRequestStart: number;
  clientRequestEnd: number;
  clientTotalTime: number;
  
  // Tempos do servidor (dos headers)
  serverReceivedAt?: number;
  serverResponseTime?: number;
  serverTimestamp?: number;
  
  // Latências calculadas
  networkLatencyToServer?: number;   // Tempo para chegar ao servidor
  networkLatencyFromServer?: number; // Tempo para voltar ao cliente
  totalNetworkLatency?: number;      // Ida + volta
  
  // Informações da requisição
  method: string;
  url: string;
  statusCode: number;
}

/**
 * Wrapper para fetch que mede tempos automaticamente
 */
export async function fetchWithTiming(
  url: string,
  options?: RequestInit
): Promise<{ response: Response; metrics: TimingMetrics }> {
  
  // Marca início no cliente
  const clientRequestStart = Date.now();
  
  // Faz a requisição
  const response = await fetch(url, options);
  
  // Marca fim no cliente
  const clientRequestEnd = Date.now();
  const clientTotalTime = clientRequestEnd - clientRequestStart;
  
  // Extrai headers de timing do servidor
  const serverReceivedAt = response.headers.get('X-Request-Received-At');
  const serverResponseTime = response.headers.get('X-Response-Time');
  const serverTimestamp = response.headers.get('X-Server-Timestamp');
  
  // Calcula latências de rede
  let networkLatencyToServer: number | undefined;
  let networkLatencyFromServer: number | undefined;
  let totalNetworkLatency: number | undefined;
  
  if (serverReceivedAt && serverTimestamp) {
    const serverReceivedAtNum = parseInt(serverReceivedAt);
    const serverTimestampNum = parseInt(serverTimestamp);
    
    // Latência de ida: tempo que levou do cliente até o servidor receber
    networkLatencyToServer = serverReceivedAtNum - clientRequestStart;
    
    // Latência de volta: tempo que levou do servidor enviar até cliente receber
    networkLatencyFromServer = clientRequestEnd - serverTimestampNum;
    
    // Latência total de rede (ida + volta)
    totalNetworkLatency = networkLatencyToServer + networkLatencyFromServer;
  }
  
  const metrics: TimingMetrics = {
    clientRequestStart,
    clientRequestEnd,
    clientTotalTime,
    serverReceivedAt: serverReceivedAt ? parseInt(serverReceivedAt) : undefined,
    serverResponseTime: serverResponseTime ? parseFloat(serverResponseTime) : undefined,
    serverTimestamp: serverTimestamp ? parseInt(serverTimestamp) : undefined,
    networkLatencyToServer,
    networkLatencyFromServer,
    totalNetworkLatency,
    method: options?.method || 'GET',
    url,
    statusCode: response.status,
  };
  
  return { response, metrics };
}

/**
 * Formata métricas de timing para exibição
 */
export function formatTimingMetrics(metrics: TimingMetrics): string {
  const parts: string[] = [];
  
  parts.push(`📊 Métricas de Performance`);
  parts.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  parts.push(`Método: ${metrics.method} ${metrics.url}`);
  parts.push(`Status: ${metrics.statusCode}`);
  parts.push(``);
  parts.push(`⏱️  TEMPOS:`);
  parts.push(`  Cliente (total): ${metrics.clientTotalTime.toFixed(2)}ms`);
  
  if (metrics.serverResponseTime !== undefined) {
    parts.push(`  Servidor (processamento): ${metrics.serverResponseTime.toFixed(2)}ms`);
  }
  
  if (metrics.networkLatencyToServer !== undefined) {
    parts.push(``);
    parts.push(`🌐 LATÊNCIA DE REDE:`);
    parts.push(`  Ida (cliente → servidor): ${metrics.networkLatencyToServer.toFixed(2)}ms`);
    parts.push(`  Volta (servidor → cliente): ${metrics.networkLatencyFromServer!.toFixed(2)}ms`);
    parts.push(`  Total (roundtrip): ${metrics.totalNetworkLatency!.toFixed(2)}ms`);
  }
  
  return parts.join('\n');
}

/**
 * Loga métricas de timing no console com cores
 */
export function logTimingMetrics(metrics: TimingMetrics): void {
  console.log(
    `%c[${metrics.method}] ${metrics.url}`,
    'font-weight: bold; color: #3498db;'
  );
  
  console.log(
    `%c⏱️  Total: ${metrics.clientTotalTime.toFixed(2)}ms`,
    getTimeStyle(metrics.clientTotalTime)
  );
  
  if (metrics.serverResponseTime !== undefined) {
    console.log(
      `%c🔧 Servidor: ${metrics.serverResponseTime.toFixed(2)}ms`,
      getTimeStyle(metrics.serverResponseTime)
    );
  }
  
  if (metrics.totalNetworkLatency !== undefined) {
    console.log(
      `%c🌐 Rede: ${metrics.totalNetworkLatency.toFixed(2)}ms ` +
      `(↑${metrics.networkLatencyToServer!.toFixed(0)}ms / ↓${metrics.networkLatencyFromServer!.toFixed(0)}ms)`,
      getTimeStyle(metrics.totalNetworkLatency)
    );
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/**
 * Retorna estilo CSS baseado no tempo
 */
function getTimeStyle(timeMs: number): string {
  if (timeMs < 100) {
    return 'color: #27ae60; font-weight: bold;'; // Verde
  } else if (timeMs < 500) {
    return 'color: #f39c12; font-weight: bold;'; // Amarelo
  } else if (timeMs < 1000) {
    return 'color: #e67e22; font-weight: bold;'; // Laranja
  } else {
    return 'color: #e74c3c; font-weight: bold;'; // Vermelho
  }
}
