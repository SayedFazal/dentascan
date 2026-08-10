import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.05'], // failure rate must be less than 5%
    http_req_duration: ['p(95)<1500'], // 95% of requests must complete below 1500ms
  },
};

export default function () {
  const baseUrl = __ENV.BACKEND_URL || 'http://127.0.0.1:3000';

  // 1. Health check endpoint GET /
  const healthRes = http.get(`${baseUrl}/`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 1500ms': (r) => r.timings.duration < 1500,
  });

  // 2. Predict endpoint POST /api/predict (sample base64 payload)
  const payload = JSON.stringify({
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const predictRes = http.post(`${baseUrl}/api/predict`, payload, params);
  check(predictRes, {
    'predict status is 200': (r) => r.status === 200,
    'predict response has label': (r) => r.json() && (r.json().label !== undefined || r.json().prediction !== undefined),
  });

  sleep(0.1);
}
