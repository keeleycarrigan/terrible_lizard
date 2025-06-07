# Android Generator Testing Guide

This guide provides comprehensive testing procedures for both Docker and native Android development workflows.

## 🧪 Test Setup

### Prerequisites for Testing
```bash
# Ensure clean slate
cd /Users/weensboro/Sites/terrible_lizard
rm -rf apps/test-*android*

# Generate fresh test project
pnpm nx g @terrible-lizard/generators:create-app test-android-full \
  --type=android-native \
  --packageName=com.test.android \
  --skip-git
```

## 🐳 Docker Workflow Testing

### Test 1: Docker Environment Setup
```bash
cd apps/test-android-full

# Verify Docker files exist
ls -la | grep -E "(Dockerfile|docker|\.docker)"

# Expected output:
# -rw-r--r-- .dockerignore
# -rw-r--r-- Dockerfile  
# -rw-r--r-- docker-compose.yml
```

### Test 2: Docker Build Process
```bash
# Test Docker image builds successfully
docker-compose build

# Expected: No build errors, Android SDK downloaded, Java 11 installed
```

### Test 3: Docker Development Container
```bash
# Start development container
docker-compose up -d android-app

# Verify container is running
docker ps | grep test-android-full

# Test interactive shell
docker-compose exec android-app bash

# Inside container, verify environment
echo $ANDROID_HOME
echo $JAVA_HOME
java -version  # Should show Java 11
./gradlew --version
```

### Test 4: Docker Build Commands
```bash
# Test build inside Docker
docker-compose run --rm android-app ./gradlew assembleDebug

# Test using Nx Docker commands
pnpm nx docker-build test-android-full
pnpm nx docker-run test-android-full

# Verify APK is generated
docker-compose run --rm android-app ls -la app/build/outputs/apk/debug/
```

### Test 5: Docker Development Workflow
```bash
# Test all Gradle commands in Docker
docker-compose run --rm android-app ./gradlew test
docker-compose run --rm android-app ./gradlew ktlintCheck
docker-compose run --rm android-app ./gradlew detekt
docker-compose run --rm android-app ./gradlew clean
```

## 🏠 Native Workflow Testing

### Test 6: Native Environment Prerequisites
```bash
# Check Java version (must be 11+)
java -version

# Check Android SDK
echo $ANDROID_HOME
ls $ANDROID_HOME/platforms/
ls $ANDROID_HOME/build-tools/

# If Java 8, install Java 11+
# macOS: brew install openjdk@11
# Ubuntu: sudo apt-get install openjdk-11-jdk
```

### Test 7: Gradle Wrapper Setup
```bash
cd apps/test-android-full

# Make gradlew executable
chmod +x gradlew

# Download gradle-wrapper.jar
curl -L https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar \
  -o gradle/wrapper/gradle-wrapper.jar

# Test wrapper works
./gradlew --version
```

### Test 8: Native Build Process
```bash
# Test debug build
./gradlew assembleDebug

# Verify APK generated
ls -la app/build/outputs/apk/debug/

# Test release build
./gradlew assembleRelease

# Verify both APKs exist
ls -la app/build/outputs/apk/*/
```

### Test 9: Native Testing & Quality
```bash
# Run unit tests
./gradlew test

# Check test results
cat app/build/reports/tests/testDebugUnitTest/index.html

# Run code quality checks
./gradlew ktlintCheck
./gradlew detekt

# Format code
./gradlew ktlintFormat
```

### Test 10: Nx Integration (Native)
```bash
# Test all Nx targets work natively
pnpm nx build test-android-full
pnpm nx test test-android-full
pnpm nx lint test-android-full
pnpm nx format test-android-full
pnpm nx analyze test-android-full
pnpm nx clean test-android-full
```

## 🔄 Comparative Testing

### Test 11: Build Output Comparison
```bash
# Build with Docker
docker-compose run --rm android-app ./gradlew clean assembleDebug
docker-compose run --rm android-app cp app/build/outputs/apk/debug/app-debug.apk /app/docker-build.apk

# Build natively
./gradlew clean assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk native-build.apk

# Compare APK files (should be nearly identical except timestamps)
ls -la *-build.apk
# file *-build.apk
```

### Test 12: Performance Comparison
```bash
# Time Docker build
time docker-compose run --rm android-app ./gradlew clean assembleDebug

# Time native build
time ./gradlew clean assembleDebug

# Compare build times (Docker may be slower on first run, faster with caching)
```

## 📱 Device Testing (Both Workflows)

### Test 13: Emulator Testing
```bash
# Start Android emulator (if available)
emulator @Pixel_7_API_34 &

# Wait for emulator to boot
adb wait-for-device

# Install APK (Docker-built)
adb install app/build/outputs/apk/debug/app-debug.apk

# Test app launches
adb shell am start -n com.test.android/.MainActivity

# Uninstall and test native-built APK
adb uninstall com.test.android
adb install app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.test.android/.MainActivity
```

### Test 14: Instrumentation Tests
```bash
# Run UI tests with Docker
docker-compose run --rm android-app ./gradlew connectedAndroidTest

# Run UI tests natively
./gradlew connectedAndroidTest

# Compare test results
```

## 🧹 Clean Environment Testing

### Test 15: Fresh Environment Simulation
```bash
# Test Docker on clean machine (no Android SDK)
# Temporarily rename Android SDK to simulate clean environment
mv $ANDROID_HOME $ANDROID_HOME.backup

# Docker should still work
docker-compose run --rm android-app ./gradlew assembleDebug

# Native should fail gracefully
./gradlew assembleDebug  # Should show helpful error about missing SDK

# Restore environment
mv $ANDROID_HOME.backup $ANDROID_HOME
```

## 📊 Test Results Matrix

Create a test results matrix to track both workflows:

| Test Case | Docker ✓/✗ | Native ✓/✗ | Notes |
|-----------|------------|------------|-------|
| Environment Setup | | | |
| Build Process | | | |
| Unit Tests | | | |
| Code Quality | | | |
| APK Generation | | | |
| Nx Integration | | | |
| Performance | | | |
| Device Testing | | | |

## 🚨 Common Issues & Solutions

### Docker Issues
```bash
# If Docker build fails
docker system prune -f
docker-compose build --no-cache

# If permission issues
docker-compose run --rm android-app chmod +x gradlew

# If SDK license issues
docker-compose run --rm android-app yes | sdkmanager --licenses
```

### Native Issues
```bash
# If Java version wrong
export JAVA_HOME=/path/to/java11
export PATH=$JAVA_HOME/bin:$PATH

# If Android SDK not found
export ANDROID_HOME=/path/to/android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME

# If gradlew not executable
chmod +x gradlew

# If gradle-wrapper.jar missing
curl -L https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar \
  -o gradle/wrapper/gradle-wrapper.jar
```

## 🎯 Success Criteria

Both workflows should achieve:

✅ **Build Success**: APK files generated without errors
✅ **Test Success**: All unit tests pass
✅ **Quality Success**: Code linting and analysis complete
✅ **Performance**: Reasonable build times
✅ **Nx Integration**: All 13 targets work correctly
✅ **Documentation**: Clear setup instructions
✅ **Error Handling**: Helpful error messages when setup incomplete

## 🔄 Continuous Testing

### Automated Test Script
```bash
#!/bin/bash
# test-android-workflows.sh

echo "🧪 Testing Android Generator Workflows..."

# Clean slate
rm -rf apps/test-android-*

# Generate test project
pnpm nx g @terrible-lizard/generators:create-app test-android-ci \
  --type=android-native \
  --packageName=com.ci.test \
  --skip-git

cd apps/test-android-ci

# Test Docker workflow
echo "🐳 Testing Docker workflow..."
docker-compose build
docker-compose run --rm android-app ./gradlew assembleDebug
echo "✅ Docker build: SUCCESS"

# Test native workflow (if Java 11+ available)
if java -version 2>&1 | grep -q "11\|1[2-9]\|[2-9][0-9]"; then
  echo "🏠 Testing Native workflow..."
  chmod +x gradlew
  curl -L https://github.com/gradle/gradle/raw/v8.5.0/gradle/wrapper/gradle-wrapper.jar \
    -o gradle/wrapper/gradle-wrapper.jar
  ./gradlew assembleDebug
  echo "✅ Native build: SUCCESS"
else
  echo "⚠️ Native build: SKIPPED (Java 11+ required)"
fi

echo "🎉 All tests completed!"
```

This comprehensive testing approach ensures both Docker and native workflows are production-ready and provides users with confidence in either development path they choose. 
