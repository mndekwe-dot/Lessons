# 04 — CNNs and Computer Vision

**Week 23.** Where neural networks genuinely and unarguably beat everything else.

---

## Table of Contents

1. [Why a dense layer fails on images](#1-why-a-dense-layer-fails-on-images)
2. [The convolution](#2-the-convolution)
3. [Pooling](#3-pooling)
4. [A CNN](#4-a-cnn)
5. [Architectures worth knowing](#5-architectures-worth-knowing)
6. [Transfer learning — what you will actually do](#6-transfer-learning--what-you-will-actually-do)
7. [Augmentation](#7-augmentation)
8. [Vision in your context — and the constraint that matters](#8-vision-in-your-context--and-the-constraint-that-matters)
9. [Exercise 4](#exercise-4)

---

## 1. Why a dense layer fails on images

A 224×224 RGB image flattened is 150,528 numbers. A dense layer with 1,000 hidden units
needs 150 million parameters — for one layer.

Worse, flattening destroys the structure: pixel (0,0) and pixel (0,1) are neighbours, and
a dense layer has no idea. A cat shifted three pixels right is, to a dense layer, a
completely different input.

Convolutions fix both problems at once with two ideas:

- **Local connectivity** — a neuron sees a small patch, not the whole image
- **Weight sharing** — the same filter slides across the image, so an edge detector works
  anywhere

That gives **translation equivariance**: move the input, the feature map moves the same
way. It is the right inductive bias for images, and it is why CNNs need orders of
magnitude less data than a dense network would.

## 2. The convolution

A small kernel (3×3 typically) slides over the input, computing a dot product at each
position. `01-mathematics/01-LINEAR_ALGEBRA.md §2` again — the filter asks "how well does
this patch match my pattern?"

```python
nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, stride=1, padding=1)
```

| Parameter | Effect |
|---|---|
| `kernel_size` | Receptive field. 3×3 is near-universal |
| `stride` | Step size. 2 halves the spatial dimensions |
| `padding` | Zeros around the edge. `padding=1` with 3×3 preserves size |
| `out_channels` | Number of filters = number of features learned |

**Output size:** `(in + 2·pad − kernel) / stride + 1`. Compute it. Shape errors between
the last conv and the first dense layer are the most common CNN bug.

**Parameter count for a conv layer:** `out_ch × in_ch × k × k + out_ch`. A 3→32 layer with
3×3 kernels is 896 parameters — versus 150 million for the dense equivalent. That
reduction is the whole point.

**What the layers learn**, empirically and consistently: early layers learn edges and
colour blobs, middle layers learn textures and parts, late layers learn objects. This
hierarchy is why transfer learning works.

## 3. Pooling

```python
nn.MaxPool2d(kernel_size=2, stride=2)      # halve spatial dimensions
```

Reduces resolution, enlarges the effective receptive field, and adds a little translation
*invariance*. Modern architectures often use strided convolutions instead, which learn
the downsampling rather than fixing it.

`nn.AdaptiveAvgPool2d(1)` collapses each channel to one number, letting a network accept
any input size. It is what modern classifiers use before the final linear layer.

## 4. A CNN

```python
class SimpleCNN(nn.Module):
    def __init__(self, n_classes):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1), nn.BatchNorm2d(128), nn.ReLU(),
            nn.AdaptiveAvgPool2d(1),
        )
        self.classifier = nn.Linear(128, n_classes)

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x.flatten(1))
```

Channels grow as spatial size shrinks — the standard pattern. You trade "where" for
"what".

## 5. Architectures worth knowing

| Architecture | Contribution |
|---|---|
| LeNet (1998) | The idea |
| AlexNet (2012) | ReLU, dropout, GPUs — started the era |
| VGG (2014) | Depth with uniform 3×3 blocks |
| **ResNet (2015)** | **Residual connections — depth became possible** |
| EfficientNet (2019) | Principled scaling of depth/width/resolution |
| Vision Transformer (2020) | Attention instead of convolution |

**ResNet is the one to understand.** Before it, deeper networks performed *worse* — not
from overfitting, but because gradients could not reach the early layers.

```python
out = F.relu(self.bn2(self.conv2(F.relu(self.bn1(self.conv1(x))))) + x)   # the + x
```

That `+ x` gives the gradient a path multiplied by 1, straight through
(`01-mathematics/04-CALCULUS_FOR_ML.md §7`). It is why 150-layer networks train, and it
is the answer to the Checkpoint 5 question about residual connections.

## 6. Transfer learning — what you will actually do

You will almost never train a CNN from scratch. Someone has trained on 14 million images;
use it.

```python
from torchvision import models

model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)

for p in model.parameters():           # freeze the backbone
    p.requires_grad = False

model.fc = nn.Linear(model.fc.in_features, n_classes)   # new head, trainable
```

**The strategy, by dataset size:**

| Your data | Approach |
|---|---|
| < 1,000 images | Freeze everything, train only the head |
| 1,000–10,000 | Train head, then unfreeze the last block at a low LR |
| > 10,000 | Fine-tune the whole network at a low LR (1e-4 or below) |

**Use a lower learning rate when fine-tuning** — typically 10× lower than for training
from scratch. The pretrained weights are already good; large steps destroy them, which is
called catastrophic forgetting.

**Match the preprocessing exactly.** ImageNet models expect specific normalisation:

```python
transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
```

Getting this wrong degrades accuracy quietly, with no error. It is the vision equivalent
of training/serving skew.

## 7. Augmentation

With small datasets this matters more than architecture.

```python
train_tf = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.2, 0.2, 0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean, std),
])
val_tf = transforms.Compose([               # NO augmentation on validation
    transforms.Resize(256), transforms.CenterCrop(224),
    transforms.ToTensor(), transforms.Normalize(mean, std),
])
```

**Augment training only.** Augmented validation gives noisy, incomparable numbers.

**Augmentations must be label-preserving.** Horizontal flip is fine for cats and wrong for
handwritten text and for medical images with left/right significance. Think about what
the flip means before applying it.

## 8. Vision in your context — and the constraint that matters

Realistic applications for Imboni and Screening:

- **OCR of paper attendance sheets** — genuine value for schools with patchy
  connectivity. Use an existing OCR engine (Tesseract, PaddleOCR) before training
  anything.
- **Document classification** — sorting scanned forms.
- **Screening's camera guide** already covers the capture side.

**And the hard line:** any vision model applied to **images of children** — face
recognition, attendance by face, emotion detection — is a serious ethical and legal
matter, not a technical exercise. Face recognition on minors is prohibited or tightly
restricted in many jurisdictions, and emotion recognition from faces has weak scientific
support regardless of the law.

Do not build it. If someone asks you to, `07-enterprise/02` and `03` are where you get
the argument for saying no.

---

## Exercise 4

1. Compute by hand the output shape of a 3×3 conv, stride 2, padding 1, on a 64×64 input.
   Verify with PyTorch.
2. Count the parameters in a `Conv2d(3, 32, 3)` and in the dense layer that would see the
   same input. Report the ratio.
3. Train the `SimpleCNN` above on CIFAR-10 or Fashion-MNIST. Report test accuracy.
4. Fine-tune a pretrained ResNet on the same data. Compare accuracy **and wall-clock
   training time**.
5. Deliberately use the wrong normalisation constants with a pretrained model. How much
   accuracy do you lose? Note that nothing errored.
6. Train on 500 images with and without augmentation. Report the gap.
7. Visualise the first conv layer's filters. Do you see edge detectors?
8. Implement a residual block. Train a 20-layer network with and without the skip
   connections. Show that only one of them trains.

Exercise 8 is the demonstration that makes ResNet's contribution concrete rather than a
fact you have read.
