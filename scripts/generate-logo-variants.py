"""Gera as variantes do logo da OAB Maranhão a partir do arquivo original.

O logo original (src/assets/logo-oabma.png) tem o texto "MARANHÃO" e o slogan
em branco, para fundos escuros. Este script produz, sem alterar desenho nem
proporções:

- logo-oabma-light.png: mesmo logo com o texto recolorido para o preto da
  marca (Pantone Black C, #231F20), para fundos claros — como o manual da OAB
  aplica o nome do estado sobre fundo branco.
- logo-oabma-symbol.png: recorte apenas do símbolo (globo + "AB"), usado na
  barra lateral recolhida.

Uso: python3 scripts/generate-logo-variants.py  (requer Pillow)
"""

from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
SOURCE = ASSETS / "logo-oabma.png"

EXPECTED_SIZE = (1071, 337)
BRAND_BLACK = (0x23, 0x1F, 0x20)

# Regiões do texto branco no logo original (medidas sobre o PNG 1071x337).
# O globo (x < 240, y < 240) fica de fora para preservar a faixa
# "ORDEM DOS ADVOGADOS DO BRASIL" e as estrelas brancas.
TEXT_BELOW_Y = 242  # "MARANHÃO"
TEXT_RIGHT_OF_X = 570  # slogan "FORTE E AO SEU LADO"

# Símbolo (globo + "AB"), com uma pequena margem de proteção.
SYMBOL_BOX = (0, 6, 558, 238)


def main() -> None:
    logo = Image.open(SOURCE).convert("RGBA")
    if logo.size != EXPECTED_SIZE:
        raise SystemExit(
            f"{SOURCE.name} tem {logo.size}, esperado {EXPECTED_SIZE}. "
            "Revise as regiões do script antes de gerar as variantes."
        )

    light = logo.copy()
    pixels = light.load()
    width, height = light.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            in_text = y >= TEXT_BELOW_Y or x >= TEXT_RIGHT_OF_X
            if in_text and a > 0:
                pixels[x, y] = (*BRAND_BLACK, a)
    light.save(ASSETS / "logo-oabma-light.png", optimize=True)

    logo.crop(SYMBOL_BOX).save(ASSETS / "logo-oabma-symbol.png", optimize=True)

    print("Gerados: logo-oabma-light.png, logo-oabma-symbol.png")


if __name__ == "__main__":
    main()
