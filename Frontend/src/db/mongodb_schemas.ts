/**
 * KOYLA DRISHTI: MongoDB Collections Schema Specification
 * Module: AI Video Detections & Frame Analytics
 * 
 * MongoDB is utilized for high-throughput, unstructured AI-related payloads:
 * - yolo_detections
 * - frame_analysis
 * - ai_model_outputs
 * - detection_metadata
 * - cctv_analysis_data
 */

export interface MongoYOLODetectionDoc {
  _id: string; // ObjectId string
  cameraId: string;
  mineId: string;
  timestamp: string;
  frameSequenceNumber: number;
  modelName: 'yolov8x-coal-safety-v2' | 'yolov8n-mine-ppe';
  inferenceTimeMs: number;
  resolution: { width: number; height: number };
  detections: Array<{
    class: string;
    label: string;
    confidence: number;
    bbox: [number, number, number, number]; // [x1, y1, x2, y2]
    trackId?: number;
    colorHex: string;
  }>;
  ppeCompliance: {
    workersCount: number;
    helmetsCount: number;
    noHelmetsCount: number;
    vestsCount: number;
    noVestsCount: number;
    compliancePercentage: number;
  };
}

export interface MongoFrameAnalysisDoc {
  _id: string;
  cameraId: string;
  frameHash: string;
  timestamp: string;
  openCvPreprocessing: {
    gaussianBlurApplied: boolean;
    contrastAdjustment: number;
    claheEnabled: boolean;
    opticalFlowMotionScore: number;
  };
  thermalAnomalies?: {
    hotspotDetected: boolean;
    maxTempCelsius?: number;
  };
  smokeDensityScore: number;
  fireProbability: number;
  storageS3Key: string;
}

export interface MongoAIModelOutputDoc {
  _id: string;
  inferenceId: string;
  eventId?: string;
  rawTensorsSummary: {
    inputShape: [number, number, number, number];
    outputBoxes: number;
    nmsThreshold: number;
    iouThreshold: number;
  };
  evaluatedRules: Array<{
    ruleId: string;
    matched: boolean;
    persistenceMet: boolean;
    evaluatedAt: string;
  }>;
}

export interface MongoCCTVAnalysisDataDoc {
  _id: string;
  cameraId: string;
  hourBucket: string; // "2026-09-11T13:00:00Z"
  aggregateStats: {
    framesAnalyzed: number;
    fpsAverage: number;
    totalDetections: number;
    violationsTriggered: number;
    uptimePercentage: number;
  };
}
