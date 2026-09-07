"""
Dataset Acquisition & Setup Script for KOYLA DRISHTI ML Subsystem.
Configures directory layout and downloads or prepares sample annotations for:
1. PPE Detection (Safety Helmets, Reflective Vests, Boots, Gloves, Goggles)
2. Open-Pit Hazard Detection (Fire, Smoke, Pit Instability)
3. Statutory Document Understanding (DGMS Forms, Environmental Clearance)
"""

import os
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("koyla_drishti.ml.dataset")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")

def setup_dataset_structure():
    """Create directory structure and YAML configuration files."""
    ppe_dir = os.path.join(DATASETS_DIR, "ppe")
    hazard_dir = os.path.join(DATASETS_DIR, "hazard")
    docs_dir = os.path.join(DATASETS_DIR, "documents")

    for d in [
        os.path.join(ppe_dir, "images", "train"),
        os.path.join(ppe_dir, "images", "val"),
        os.path.join(ppe_dir, "labels", "train"),
        os.path.join(ppe_dir, "labels", "val"),
        os.path.join(hazard_dir, "images"),
        os.path.join(docs_dir, "samples")
    ]:
        os.makedirs(d, exist_ok=True)

    # 1. Write data.yaml for YOLO PPE training
    data_yaml_path = os.path.join(ppe_dir, "data.yaml")
    yaml_content = f"""# KOYLA DRISHTI Mining PPE Dataset Configuration
path: {ppe_dir.replace('\\', '/')}
train: images/train
val: images/val

names:
  0: person
  1: helmet
  2: no-helmet
  3: vest
  4: no-vest
  5: boot
  6: no-boot
  7: gloves
  8: goggles
"""
    with open(data_yaml_path, "w", encoding="utf-8") as f:
        f.write(yaml_content)
    logger.info(f"Generated YOLO PPE configuration at: {data_yaml_path}")

    # 2. Write metadata instructions
    meta_path = os.path.join(DATASETS_DIR, "README.md")
    with open(meta_path, "w", encoding="utf-8") as f:
        f.write("""# KOYLA DRISHTI Machine Learning Datasets

### Supported Datasets:
1. **Roboflow Universe Hard Hat Workers / Pictor PPE**:
   - Classes: person, helmet, no-helmet, vest, no-vest, boot, no-boot, gloves, goggles
   - Export format: YOLOv8 PyTorch TXT annotations
   - Place training images in `ppe/images/train/` and labels in `ppe/labels/train/`.

2. **FLAME / D-Fire Hazard Dataset**:
   - Open-cast mining thermal emissions and smoke plumes.

3. **Statutory Mining Documents (SROIE / FUNSD / DocBank)**:
   - Reference templates for DGMS Form B and Statutory Clearance Certificates.
""")
    logger.info("Dataset directories and reference specs initialized.")

if __name__ == "__main__":
    setup_dataset_structure()
