# Hybrid Classical–Quantum CNN for Alzheimer’s Disease Detection

This is a research project for CSE299 course at NSU under [Dr. Mohammad Shifat-E-Rabbi [MSRb]](https://ece.northsouth.edu/people/dr-mohammad-shifat-e-rabbi/).

---

## Overview

This project implements and evaluates a **Hybrid Classical–Quantum Convolutional Neural Network (CQ-CNN)** for the automated detection of **Alzheimer’s Disease (AD)** using 3D structural MRI data.

The goal is to explore the potential of **quantum machine learning** in medical imaging by combining classical deep learning with **Parameterized Quantum Circuits (PQC)** to achieve high accuracy with significantly fewer parameters.

---

## Motivation

Early detection of Alzheimer’s disease is critical for timely intervention and improved patient care.
Traditional CNN-based approaches have shown strong performance but often require large models and high computational resources.

Hybrid classical–quantum models may:

- Reduce model size and parameter count
- Improve computational efficiency
- Provide insights into future quantum medical imaging systems

---

## Objectives

The main objectives of this project are:

1. Convert **3D MRI volumes → 2D slices** for efficient processing
2. Implement a **Hybrid Classical–Quantum CNN (CQ-CNN)**
3. Compare performance with **classical CNNs** under equal parameter constraints
4. Investigate **convergence limitations** of hybrid quantum models
5. Evaluate the feasibility of quantum-assisted medical imaging systems

---

## Dataset

We use the **OASIS-2 MRI Dataset**, which contains longitudinal MRI scans categorized into:

- Non-Dementia
- Very Mild Dementia
- Mild Dementia
- Moderate Dementia

Dataset includes **3D structural brain MRI volumes**.

---

## Methodology

### 1. Preprocessing Pipeline

- Convert 3D MRI volumes into **2D slices**

- Extract slices from:
  - Axial plane
  - Coronal plane
  - Sagittal plane

- Remove:
  - Non-informative slices (top & bottom of volume)
  - Skull and non-brain regions

- Apply data augmentation:
  - GAN-based generation
  - Diffusion models
  - Standard augmentation techniques

---

### 2. Hybrid CQ-CNN Architecture

The model consists of two major components:

#### Classical Component

- Convolutional layers for feature extraction
- Pooling and flattening layers
- Feature embedding for quantum circuit input

#### Quantum Component

Parameterized Quantum Circuit (PQC) with:

- Data encoding
- Ansatz (variational layers)
- Quantum measurement
- Classical optimizer for training

Quantum simulation is performed using:

- **Qiskit**
- **PennyLane**

---

## Tools & Technologies

### Programming & ML

- Python
- PyTorch / TensorFlow
- NumPy
- OpenCV

### Quantum Computing

- Qiskit
- PennyLane

### Data Processing

- Nibabel
- Scikit-learn
- Matplotlib

---

## Expected Outcomes

We expect to demonstrate that:

- Hybrid CQ-CNN models can achieve **high accuracy** with **fewer parameters**
- Hybrid architectures face **convergence challenges** for similar MRI classes
- Quantum-assisted medical imaging is **promising but still emerging**

---

## Future Work

- Improve quantum optimization methods
- Experiment on real quantum hardware
- Extend hybrid models to other medical imaging tasks
