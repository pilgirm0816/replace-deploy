# build windows app
# Once the shell script has executed successfully
# you can open it in a folder and execute it
# so that you have a windows version of the conversion system deployment App

# Get work folder
cd
set "current_dir=%CD%"
# Build App
cd %current_dir% && go build -ldflags="-w -s" -o bin/Win/Replace-Deploy/Replace-Deploy.exe main.go

copy  static bin/Win/Replace-Deploy/

echo "Build Success! Start your rapid deployment steps"