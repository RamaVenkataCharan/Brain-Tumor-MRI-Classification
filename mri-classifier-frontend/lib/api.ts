export interface PredictionResponse {
  class_name: string;
  class_index: number;
  confidence: number;
  probabilities: Record<string, number>;
}

const API_BASE = "http://localhost:8000";

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000), // 3s timeout
    });
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

export async function predictMRI(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Prediction failed");
  }

  return res.json();
}

/**
 * Mock prediction fallback for testing/demo purposes when backend is offline
 */
export async function mockPredictMRI(fileName: string): Promise<PredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network latency

  // Deterministic mock based on filename or random
  const nameLower = fileName.toLowerCase();
  let predictedClass = "notumor";
  let confidence = 0.95 + Math.random() * 0.04;

  if (nameLower.includes("glioma")) {
    predictedClass = "glioma";
  } else if (nameLower.includes("meningioma")) {
    predictedClass = "meningioma";
  } else if (nameLower.includes("pituitary")) {
    predictedClass = "pituitary";
  } else if (nameLower.includes("tumor") || Math.random() > 0.5) {
    // Random tumor type
    const types = ["glioma", "meningioma", "pituitary"];
    predictedClass = types[Math.floor(Math.random() * types.length)];
  }

  const classes = ["glioma", "meningioma", "notumor", "pituitary"];
  const probabilities: Record<string, number> = {};
  
  let remaining = 1.0 - confidence;
  classes.forEach((c) => {
    if (c === predictedClass) {
      probabilities[c] = confidence;
    } else {
      const share = Math.random();
      probabilities[c] = remaining * share;
      remaining -= probabilities[c];
    }
  });
  
  // Clean up remaining probability on last one
  const lastClass = classes.find((c) => c !== predictedClass && probabilities[c] === undefined) || classes[0];
  probabilities[lastClass] = (probabilities[lastClass] || 0) + remaining;

  return {
    class_name: predictedClass,
    class_index: classes.indexOf(predictedClass),
    confidence: confidence,
    probabilities: probabilities,
  };
}
