#!/usr/bin/env bash
# Generate PNG assets from icon-source.svg
# Requires: librsvg (rsvg-convert) OR inkscape OR ImageMagick
#
# Usage:  bash scripts/generate-assets.sh
#
# Outputs:
#   assets/icon.png              1024x1024
#   assets/adaptive-icon.png     1024x1024
#   assets/splash.png            1242x2436 (centered icon on navy bg)
#   assets/notification-icon.png 96x96 white silhouette

set -e
cd "$(dirname "$0")/.."

SRC="assets/icon-source.svg"

if [ ! -f "$SRC" ]; then
  echo "Source SVG not found: $SRC"
  exit 1
fi

# Pick available tool
if command -v rsvg-convert >/dev/null 2>&1; then
  TOOL="rsvg"
elif command -v inkscape >/dev/null 2>&1; then
  TOOL="inkscape"
elif command -v convert >/dev/null 2>&1; then
  TOOL="imagemagick"
else
  echo "Need one of: rsvg-convert, inkscape, or ImageMagick (convert)"
  echo "macOS:    brew install librsvg"
  echo "Ubuntu:   sudo apt install librsvg2-bin"
  echo "Windows:  choco install rsvg-convert"
  exit 1
fi

render() {
  local out="$1" w="$2" h="$3"
  case "$TOOL" in
    rsvg)       rsvg-convert -w "$w" -h "$h" "$SRC" -o "$out" ;;
    inkscape)   inkscape "$SRC" -o "$out" -w "$w" -h "$h" ;;
    imagemagick) convert -background none -resize "${w}x${h}" "$SRC" "$out" ;;
  esac
  echo "✓ $out (${w}x${h})"
}

# 1. Main icon
render assets/icon.png 1024 1024

# 2. Adaptive icon — same source, Expo handles masking via backgroundColor
render assets/adaptive-icon.png 1024 1024

# 3. Splash — render icon at 600px on 1242x2436 navy background
TMP=$(mktemp -t kc.XXXXXX.png)
render "$TMP" 600 600
if command -v convert >/dev/null 2>&1; then
  convert -size 1242x2436 xc:'#1e3a5f' "$TMP" -gravity center -composite assets/splash.png
  rm -f "$TMP"
  echo "✓ assets/splash.png (1242x2436)"
else
  echo "⚠ ImageMagick not installed — splash.png skipped (install convert to enable)"
  rm -f "$TMP"
fi

# 4. Notification icon — white silhouette
if command -v convert >/dev/null 2>&1; then
  TMP2=$(mktemp -t kc-n.XXXXXX.png)
  render "$TMP2" 96 96
  convert "$TMP2" -alpha extract -background white -alpha shape -channel RGB -evaluate set 100% +channel assets/notification-icon.png
  rm -f "$TMP2"
  echo "✓ assets/notification-icon.png (96x96 monochrome)"
else
  echo "⚠ Notification icon needs hand-edit — make 96x96 PNG with white-only foreground on transparent"
fi

echo ""
echo "Done. Inspect generated files in assets/"
