#!/bin/bash

# Script to create placeholder sound files for ContainerComedy Club
# This creates silent audio files so the app doesn't throw errors

echo "🎵 Creating placeholder sound files..."

# Create sounds directory if it doesn't exist
mkdir -p public/sounds

# Check if ffmpeg is available
if command -v ffmpeg &> /dev/null; then
    echo "✅ ffmpeg found - creating actual silent MP3 files"
    
    # Create 2-second silent drum roll placeholder
    ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 2 -q:a 9 -acodec libmp3lame public/sounds/drumroll.mp3 -y 2>/dev/null
    
    # Create 1-second silent rimshot placeholder
    ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 1 -q:a 9 -acodec libmp3lame public/sounds/rimshot.mp3 -y 2>/dev/null
    
    echo "✅ Created silent placeholder sound files"
    echo "   - public/sounds/drumroll.mp3"
    echo "   - public/sounds/rimshot.mp3"
else
    echo "⚠️  ffmpeg not found - creating empty files"
    echo "   The app will work but sounds won't play"
    
    touch public/sounds/drumroll.mp3
    touch public/sounds/rimshot.mp3
fi

echo ""
echo "📝 To add real sound effects:"
echo "   1. Download drum roll and rimshot sounds from:"
echo "      - https://freesound.org/"
echo "      - https://www.zapsplat.com/"
echo "   2. Replace the files in public/sounds/"
echo "   3. Rebuild: docker compose up --build"
echo ""
echo "✨ Done!"
