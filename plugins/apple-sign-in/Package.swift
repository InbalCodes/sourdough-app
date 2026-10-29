// swift-tools-version: 5.9
import PackageDescription

// Local plugin. The package and product name must be "LevainAppleSignIn":
// Capacitor derives it from the npm name "levain-apple-sign-in".
let package = Package(
    name: "LevainAppleSignIn",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "LevainAppleSignIn",
            targets: ["LevainAppleSignInPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "LevainAppleSignInPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/LevainAppleSignInPlugin")
    ]
)
