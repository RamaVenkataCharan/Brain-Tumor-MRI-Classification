export interface ClassMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  support: number;
}

export interface ModelMetrics {
  name: string;
  accuracy: number;
  trainLoss: number;
  testLoss: number;
  macroAvg: {
    precision: number;
    recall: number;
    f1Score: number;
  };
  classes: {
    glioma: ClassMetrics;
    meningioma: ClassMetrics;
    notumor: ClassMetrics;
    pituitary: ClassMetrics;
  };
  confusionMatrix: number[][]; // 4x4 matrix
}

export const classNames = ["glioma", "meningioma", "notumor", "pituitary"];
export const classLabels: Record<string, string> = {
  glioma: "Glioma Tumor",
  meningioma: "Meningioma Tumor",
  notumor: "No Tumor",
  pituitary: "Pituitary Tumor",
};

export const paperResults: ModelMetrics[] = [
  {
    name: "Xception",
    accuracy: 0.9912,
    trainLoss: 0.0125,
    testLoss: 0.0312,
    macroAvg: { precision: 0.991, recall: 0.991, f1Score: 0.991 },
    classes: {
      glioma: { precision: 0.988, recall: 0.985, f1Score: 0.986, support: 300 },
      meningioma: { precision: 0.987, recall: 0.990, f1Score: 0.988, support: 306 },
      notumor: { precision: 0.995, recall: 0.997, f1Score: 0.996, support: 405 },
      pituitary: { precision: 0.994, recall: 0.991, f1Score: 0.992, support: 300 },
    },
    confusionMatrix: [
      [296, 3, 1, 0],
      [3, 303, 0, 0],
      [1, 0, 404, 0],
      [0, 1, 1, 298],
    ],
  },
  {
    name: "DenseNet121",
    accuracy: 0.9885,
    trainLoss: 0.0184,
    testLoss: 0.0418,
    macroAvg: { precision: 0.988, recall: 0.988, f1Score: 0.988 },
    classes: {
      glioma: { precision: 0.981, recall: 0.983, f1Score: 0.982, support: 300 },
      meningioma: { precision: 0.984, recall: 0.980, f1Score: 0.982, support: 306 },
      notumor: { precision: 0.993, recall: 0.995, f1Score: 0.994, support: 405 },
      pituitary: { precision: 0.993, recall: 0.993, f1Score: 0.993, support: 300 },
    },
    confusionMatrix: [
      [295, 4, 1, 0],
      [5, 300, 1, 0],
      [1, 1, 403, 0],
      [0, 0, 2, 298],
    ],
  },
  {
    name: "InceptionV3",
    accuracy: 0.9863,
    trainLoss: 0.0215,
    testLoss: 0.0492,
    macroAvg: { precision: 0.986, recall: 0.986, f1Score: 0.986 },
    classes: {
      glioma: { precision: 0.978, recall: 0.980, f1Score: 0.979, support: 300 },
      meningioma: { precision: 0.980, recall: 0.977, f1Score: 0.978, support: 306 },
      notumor: { precision: 0.990, recall: 0.993, f1Score: 0.991, support: 405 },
      pituitary: { precision: 0.993, recall: 0.990, f1Score: 0.991, support: 300 },
    },
    confusionMatrix: [
      [294, 5, 1, 0],
      [6, 299, 1, 0],
      [1, 1, 402, 1],
      [0, 0, 3, 297],
    ],
  },
  {
    name: "MobileNetV2",
    accuracy: 0.9841,
    trainLoss: 0.0278,
    testLoss: 0.0583,
    macroAvg: { precision: 0.984, recall: 0.984, f1Score: 0.984 },
    classes: {
      glioma: { precision: 0.973, recall: 0.977, f1Score: 0.975, support: 300 },
      meningioma: { precision: 0.977, recall: 0.974, f1Score: 0.975, support: 306 },
      notumor: { precision: 0.988, recall: 0.990, f1Score: 0.989, support: 405 },
      pituitary: { precision: 0.990, recall: 0.987, f1Score: 0.988, support: 300 },
    },
    confusionMatrix: [
      [293, 6, 1, 0],
      [7, 298, 1, 0],
      [1, 1, 401, 2],
      [0, 0, 4, 296],
    ],
  },
  {
    name: "ResNet50",
    accuracy: 0.9782,
    trainLoss: 0.0392,
    testLoss: 0.0715,
    macroAvg: { precision: 0.978, recall: 0.978, f1Score: 0.978 },
    classes: {
      glioma: { precision: 0.967, recall: 0.970, f1Score: 0.968, support: 300 },
      meningioma: { precision: 0.971, recall: 0.967, f1Score: 0.969, support: 306 },
      notumor: { precision: 0.983, recall: 0.985, f1Score: 0.984, support: 405 },
      pituitary: { precision: 0.987, recall: 0.983, f1Score: 0.985, support: 300 },
    },
    confusionMatrix: [
      [291, 7, 2, 0],
      [8, 296, 2, 0],
      [2, 1, 399, 3],
      [0, 1, 4, 295],
    ],
  },
  {
    name: "VGG16",
    accuracy: 0.9654,
    trainLoss: 0.0612,
    testLoss: 0.1104,
    macroAvg: { precision: 0.965, recall: 0.965, f1Score: 0.965 },
    classes: {
      glioma: { precision: 0.950, recall: 0.953, f1Score: 0.951, support: 300 },
      meningioma: { precision: 0.954, recall: 0.951, f1Score: 0.952, support: 306 },
      notumor: { precision: 0.973, recall: 0.975, f1Score: 0.974, support: 405 },
      pituitary: { precision: 0.977, recall: 0.973, f1Score: 0.975, support: 300 },
    },
    confusionMatrix: [
      [286, 11, 3, 0],
      [12, 291, 3, 0],
      [3, 2, 395, 5],
      [0, 1, 7, 292],
    ],
  },
];
