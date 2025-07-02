import os
import torch
import torchvision
from tqdm import tqdm
from torch import nn
from torch.utils.data import DataLoader
from torchvision import transforms

from food101_dataset import Food101Dataset

# 디바이스 설정
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "..", "food101"))
image_dir = os.path.join(root_dir, "images")
meta_dir = os.path.join(root_dir, "meta")

# 클래스 매핑
classes = sorted(os.listdir(image_dir))
class_to_idx = {cls_name: i for i, cls_name in enumerate(classes)}
idx_to_class = {i: cls_name for cls_name, i in class_to_idx.items()}


# 데이터 로드 함수
def load_split_filtered(txt_file):
    with open(txt_file, "r") as f:
        lines = [line.strip() for line in f.readlines()]
    valid = []
    for line in lines:
        parts = line.split("/")
        full_path = os.path.join(image_dir, *parts) + ".jpg"
        if os.path.exists(full_path):
            valid.append(line)
    return valid


train_list = load_split_filtered(os.path.join(meta_dir, "train.txt"))
test_list = load_split_filtered(os.path.join(meta_dir, "test.txt"))

# 이미지 변환
train_transform = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5] * 3, std=[0.5] * 3),
    ]
)

test_transform = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5] * 3, std=[0.5] * 3),
    ]
)

# 데이터셋 & 로더
train_dataset = Food101Dataset(
    train_list, image_dir, class_to_idx, transform=train_transform
)
test_dataset = Food101Dataset(
    test_list, image_dir, class_to_idx, transform=test_transform
)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=2)
test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False, num_workers=2)

# 모델 정의 및 설정
model = torchvision.models.resnet18(weights=None, num_classes=101)
model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# 학습 루프
for epoch in range(10):
    model.train()
    running_loss, correct, total = 0.0, 0, 0
    pbar = tqdm(train_loader, desc=f"Epoch {epoch+1}")
    for imgs, labels in pbar:
        imgs, labels = imgs.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

        pbar.set_postfix(loss=running_loss / total, acc=100 * correct / total)

    print(
        f"✅ Epoch {epoch+1} 완료 | Loss: {running_loss:.4f} | Accuracy: {100 * correct / total:.2f}%"
    )

# 모델 저장
torch.save(model.state_dict(), "food101_resnet18.pt")
