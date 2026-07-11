# TrackPlayer Integration Documentation

This document explains the architecture, patch files, and compile workarounds for the TrackPlayer migration in this project.

---

## 1. Why react-native-track-player 4.x is Used
* **Apache-2.0 License**: Version 4.x is the final major release branch published under the Apache-2.0 license, which is completely free for distribution and commercial use.
* **Commercial License Shift in v5**: Starting with version 5.0 (published under the new package name `@rntp/player`), the library requires a paid commercial license for production apps.
* **API Footprint**: Version 4.x has a stable, mature API that meets all requirements for background playback, notifications, and audio focus without unnecessary runtime overhead.

---

## 2. Why patch-package Exists
React Native 0.86.0 utilizes Kotlin 2.0+ which enforces strict null-safety. In `MusicModule.kt`, the library tries to pass a nullable `Bundle?` into `Arguments.fromBundle()` which expects a non-null `Bundle`, causing a compiler type mismatch error.
* **The Solution**: We applied a Kotlin syntax patch (`originalItem ?: Bundle()`) to ensure compilation succeeds.
* **Role of patch-package**: Direct edits inside `node_modules` are wiped out whenever dependencies are re-installed or native directories are cleaned. `patch-package` captures these edits as a diff in `/patches/react-native-track-player+4.1.2.patch` and automatically reapplies them post-install.

---

## 3. Why newArchEnabled is Disabled (If it becomes necessary)
React Native 0.86.0 enables the New Architecture (TurboModules & Fabric) by default.
* **TurboModule Parsing Crash**: Because `react-native-track-player` 4.x uses legacy bridge module patterns (specifically returning Kotlin Coroutine `Job` objects from asynchronous native methods instead of `void`), the TurboModule interop parser throws a runtime parsing exception on startup.
* **Legacy Bridge Workaround**: If the crash occurs on launch, we disable the New Architecture by setting `newArchEnabled=false` in `android/gradle.properties`. This falls back to the legacy bridge architecture, which bypasses TurboModule parser validations and runs the player reliably.

---

## 4. How to Regenerate the Patch
If you ever edit files inside `node_modules/react-native-track-player` to fix native bugs:
1. Make your changes in the native files.
2. Run the patch generator:
   ```bash
   npx patch-package react-native-track-player
   ```
3. Commit the updated patch file generated under `/patches`.

---

## 5. How to Upgrade TrackPlayer in the Future
If you want to migrate to a newer version of the player (e.g., version 5.x or later):
1. **Uninstall legacy player**:
   ```bash
   npm uninstall react-native-track-player
   ```
2. **Install new package**:
   ```bash
   npm install @rntp/player
   ```
3. **Remove legacy patches**: Delete the patch file from `/patches` so it doesn't conflict during `postinstall`.
4. **API Adaptation**: Update references in `src/services/player/trackPlayer.service.ts` to adapt to any updated JSI interfaces.
