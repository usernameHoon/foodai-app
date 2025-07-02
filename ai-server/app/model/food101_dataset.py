import os
from PIL import Image
from torch.utils.data import Dataset


class Food101Dataset(Dataset):
    def __init__(self, file_list, image_dir, class_to_idx, transform=None):
        self.file_list = file_list
        self.image_dir = image_dir
        self.class_to_idx = class_to_idx
        self.transform = transform

    def __len__(self):
        return len(self.file_list)

    def __getitem__(self, idx):
        label_name, image_name = self.file_list[idx].split("/")
        image_path = os.path.join(self.image_dir, label_name, image_name + ".jpg")
        image = Image.open(image_path).convert("RGB")

        if self.transform:
            image = self.transform(image)

        label = self.class_to_idx[label_name]
        return image, label
