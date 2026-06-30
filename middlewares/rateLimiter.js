import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100,                // máximo de 100 requisições por IP
  message: {
    status: "erro",
    message: "Muitas requisições. Tente novamente em 15 minutos."
  }
});
