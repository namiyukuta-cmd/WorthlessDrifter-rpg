"""既存PNGの位置だけを素体へ合わせる。元画像は上書きしない。"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
AVATAR = ROOT / 'assets/avatar'
OUTPUT = AVATAR / 'fitted'
SIZE = (128, 128)


def vertical_fit(image, anchors):
    """襟・手首・膝・足底を合わせ、服の下端をキャンバス内に収める。"""
    output = Image.new('RGBA', SIZE)
    for (source_top, target_top), (source_bottom, target_bottom) in zip(anchors, anchors[1:]):
        strip = image.crop((0, source_top, SIZE[0], source_bottom))
        strip = strip.resize((SIZE[0], target_bottom - target_top), Image.Resampling.BICUBIC)
        output.paste(strip, (0, target_top))
    return output


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    base = Image.open(AVATAR / 'base/base_01.png')
    assert base.size == SIZE, '素体サイズが変わったため、位置の再確認が必要です'
    for number in range(1, 5):
        name = f'eyes_{number:02}.png'
        image = Image.open(AVATAR / 'eyes' / name).convert('RGBA')
        assert image.size == SIZE
        fitted = Image.new('RGBA', SIZE)
        fitted.paste(image.resize((91, 91), Image.Resampling.LANCZOS), (19, 8))
        fitted.save(OUTPUT / name)
    fits = {
        'clothes_01.png': [(0, 0), (41, 51), (76, 86), (96, 103), (128, 128)],
        'clothes_02.png': [(0, 0), (49, 51), (83, 87), (104, 105), (128, 128)],
    }
    for name, anchors in fits.items():
        image = Image.open(AVATAR / 'clothes' / name).convert('RGBA')
        assert image.size == SIZE
        vertical_fit(image, anchors).save(OUTPUT / name)


if __name__ == '__main__':
    main()
