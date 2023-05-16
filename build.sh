# Build Mac App
# Once the shell script has executed successfully
# you can open it in a folder and execute it
# so that you have a mac version of the conversion system deployment App

# /bin/zsh /<Your Project Path>/build.sh

# Get work folder
current_dir=$(pwd)
# Build App
cd "$current_dir" &&
go build -ldflags="-w -s" -o bin/Mac/Replace-Deploy.app/Contents/MacOS/Replace-Deploy build.go
# Create `logo` and `static` folder(important)
cd bin/Mac/Replace-Deploy.app/Contents &&
if [ ! -d "Resources" ]; then
  mkdir "Resources"
fi

cd "$current_dir" &&
if [ ! -d "bin/Replace-Deploy.app/Contents/static" ]; then
  cp -r static bin/Mac/Replace-Deploy.app/Contents/
fi

if [ ! -f "bin/Replace-Deploy.app/Contents/Resources/Icon.icns" ]; then
  cp bin/Mac/Replace-Deploy.app/Contents/static/Icon.icns bin/Mac/Replace-Deploy.app/Contents/Resources/
fi

# Copy `Info.plist` to `bin/Replace-Deploy.app/Contents/`(important)
cd "$current_dir" &&
if [ ! -f "bin/Replace-Deploy.app/Contents/Info.plist" ]; then
  cp Info.plist bin/Mac/Replace-Deploy.app/Contents/
fi

echo "Build Success! Start your rapid deployment steps"