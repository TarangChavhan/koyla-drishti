"""
Training & Fine-Tuning Pipeline for PPE Safety Gear Detection.
Uses Transfer Learning from YOLOv8n pretrained weights.
"""

import os
import argparse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("koyla_drishti.train_ppe")

def train(data_yaml: str, epochs: int = 50, batch_size: int = 16, img_size: int = 640):
    try:
        from ultralytics import YOLO
    except ImportError:
        logger.error("ultralytics package is required for training. Install with: pip install ultralytics")
        return

    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    os.makedirs(models_dir, exist_ok=True)

    logger.info(f"Initiating YOLOv8 fine-tuning on safety dataset: {data_yaml}")
    # Load base model
    model = YOLO("yolov8n.pt")

    # Train model
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        batch=batch_size,
        imgsz=img_size,
        project=models_dir,
        name="ppe_training_run",
        exist_ok=True
    )

    # Save best checkpoint to standard destination
    best_pt = os.path.join(models_dir, "ppe_training_run", "weights", "best.pt")
    target_pt = os.path.join(models_dir, "ppe_yolov8_best.pt")
    if os.path.exists(best_pt):
        import shutil
        shutil.copyfile(best_pt, target_pt)
        logger.info(f"Model training complete! Optimized checkpoint saved to: {target_pt}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train KOYLA DRISHTI PPE Safety Detection Model")
    parser.add_argument(
        "--data",
        default=os.path.join(os.path.dirname(__file__), "..", "datasets", "ppe", "data.yaml"),
        help="Path to data.yaml dataset specification"
    )
    parser.add_argument("--epochs", type=int, default=30, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution size")

    args = parser.parse_args()
    train(data_yaml=args.data, epochs=args.epochs, batch_size=args.batch, img_size=args.imgsz)
