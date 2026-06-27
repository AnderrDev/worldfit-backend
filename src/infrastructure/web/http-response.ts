import { Response } from 'express';
import { BusinessError } from '../../shared/business-error';

/**
 * Traduce un error capturado en un controlador a una respuesta HTTP coherente.
 * - BusinessError: usa su codigo (400/404/409...).
 * - Cualquier otro error: 500 generico (no se expone el detalle interno al
 *   cliente; se registra en el servidor para depuracion).
 */
export function handleError(res: Response, error: unknown): Response {
  if (error instanceof BusinessError) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error('[error]', error);
  return res.status(500).json({ message: 'Error interno del servidor' });
}

/**
 * Parsea el id numerico de los parametros de ruta.
 * Devuelve null si no es un entero positivo valido.
 */
export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
