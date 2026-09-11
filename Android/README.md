# KOYLA DRISHTI Android App

**AI-Powered Smart Governance & Compliance Intelligence System for Coal Mines**

This is the official Android application for the Koyla Drishti platform, built natively in Java and Android Studio.

## Architecture

* **Language:** Java 17
* **Pattern:** MVVM (Model-View-ViewModel)
* **Networking:** Retrofit2 + OkHttp
* **Database:** Room Database (for offline inspection support)
* **Background Tasks:** WorkManager
* **UI:** Material Design 3, XML Layouts
* **Navigation:** Android Jetpack Navigation Component
* **Camera:** CameraX

## Setup Instructions

1. **Android Studio:** Ensure you have the latest Android Studio installed.
2. **SDK:** Require Android SDK 34 (Android 14).
3. **Open Project:** Open the `Android` folder in Android Studio.
4. **API Base URL:** The API URL is configured in `app/build.gradle`. Update `BASE_URL` pointing to your FastAPI backend if needed.
5. **Firebase (Optional but recommended):** Add `google-services.json` to the `app/` folder to enable Firebase Cloud Messaging (FCM).
6. **Google Maps:** Add your Google Maps API key in `AndroidManifest.xml` meta-data to enable map features.

## Roles & Authentication

The application enforces strict Role-Based Access Control (RBAC):
* `ADMIN` - Government Administrator
* `INSPECTOR` - Government Inspector
* `MINE_AUTHORITY` - Mine Authority

Roles are issued securely via JWT from the backend. The app stores auth tokens securely in EncryptedSharedPreferences/Keystore and routes the user to the appropriate dashboard upon login.

## Offline Synchronization

The app uses `Room` and `WorkManager`. If an inspector loses network connectivity while submitting an inspection or capturing evidence, the payload is cached locally in Room and queued in WorkManager. Once connectivity is restored, the WorkManager syncs the queued payloads with the FastAPI backend, ensuring no data loss.

## AI Integration

This app does NOT perform heavy AI computation locally. It captures evidence (photos/documents) and sends them to the FastAPI backend. The backend processes the images via OpenCV/YOLO and returns the AI Alerts. Human inspectors then verify these alerts via the app to convert them into official violations.

## Running Tests

* **Unit Tests:** `app/src/test/java/` (Run via Android Studio or `./gradlew test`)
* **UI Tests:** `app/src/androidTest/java/` (Run via Android Studio on a connected device/emulator)

## Build

To build the APK:
```bash
./gradlew assembleDebug
```
