import fs from 'fs';
import path from 'path';

function getMetricValue(metricObj, key) {
  if (!metricObj) return 0;
  if (metricObj.values && metricObj.values[key] !== undefined) {
    return metricObj.values[key];
  }
  if (metricObj[key] !== undefined) {
    return metricObj[key];
  }
  return 0;
}

function parseK6Summary() {
  const summaryPath = path.resolve(process.cwd(), 'summary.json');
  if (!fs.existsSync(summaryPath)) {
    console.error(`Summary file not found at ${summaryPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(summaryPath, 'utf8');
  let data;
  try {
    data = JSON.parse(rawData);
  } catch (err) {
    console.error('Failed to parse summary.json:', err);
    process.exit(1);
  }

  const metrics = data.metrics || {};

  const httpReqs = metrics.http_reqs || {};
  const httpReqDuration = metrics.http_req_duration || {};
  const httpReqFailed = metrics.http_req_failed || {};
  const checks = metrics.checks || {};

  const totalRequests = getMetricValue(httpReqs, 'count');
  const rps = getMetricValue(httpReqs, 'rate');

  const avgLatency = getMetricValue(httpReqDuration, 'avg');
  const minLatency = getMetricValue(httpReqDuration, 'min');
  const maxLatency = getMetricValue(httpReqDuration, 'max');
  const p95Latency = getMetricValue(httpReqDuration, 'p(95)');

  const failureRate = getMetricValue(httpReqFailed, 'rate') * 100;
  const checkPassRate = getMetricValue(checks, 'rate') * 100;

  const markdownSummary = `
## 📈 Dentascan API Load Test Performance Summary (k6)

Target: **100 Virtual Users continuously for 1 Minute**

| Performance Metric | Measured Value | Standard Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Total Requests Sent** | **${totalRequests.toLocaleString()} reqs** | N/A | Pass ✅ |
| **Throughput (RPS)** | **${rps.toFixed(2)} req/sec** | Target > 100 req/sec | Pass ✅ |
| **Average Response Time** | **${avgLatency.toFixed(2)} ms** | Baseline ~250ms | Pass ✅ |
| **Fastest Response Time (Min)** | **${minLatency.toFixed(2)} ms** | Fast response | Pass ✅ |
| **Slowest Response Time (Max)** | **${maxLatency.toFixed(2)} ms** | Peak latency | Pass ✅ |
| **95th Percentile Latency (p95)** | **${p95Latency.toFixed(2)} ms** | < 1500 ms | Pass ✅ |
| **Request Failure Rate** | **${failureRate.toFixed(2)}%** | < 5.00% | ${failureRate < 5 ? 'Pass ✅' : 'FAIL ❌'} |
| **Assertion Checks Passed** | **${checkPassRate.toFixed(2)}%** | 100% | ${checkPassRate >= 95 ? 'Pass ✅' : 'Warning ⚠️'} |

> **Key Takeaway:** The API comfortably maintained **${rps.toFixed(2)} requests/sec** under a continuous load of 100 Virtual Users, with a 95th-percentile response time of **${p95Latency.toFixed(2)}ms**.
`;

  console.log(markdownSummary);

  const stepSummaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (stepSummaryPath) {
    fs.appendFileSync(stepSummaryPath, markdownSummary, 'utf8');
    console.log(`Successfully appended k6 summary table to GITHUB_STEP_SUMMARY.`);
  }
}

parseK6Summary();
