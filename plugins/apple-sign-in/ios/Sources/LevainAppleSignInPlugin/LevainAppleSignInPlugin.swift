import Foundation
import Capacitor
import AuthenticationServices

/// Native Sign in with Apple. JS: Capacitor.registerPlugin("LevainAppleSignIn").authorize({ nonce })
/// Resolves { user, email?, givenName?, familyName?, identityToken, authorizationCode }.
/// Rejects with code "CANCELED" when the user closes the Apple sheet.
@objc(LevainAppleSignInPlugin)
public class LevainAppleSignInPlugin: CAPPlugin, CAPBridgedPlugin,
    ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {

    public let identifier = "LevainAppleSignInPlugin"
    public let jsName = "LevainAppleSignIn"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authorize", returnType: CAPPluginReturnPromise)
    ]

    private var pendingCall: CAPPluginCall?

    @objc func authorize(_ call: CAPPluginCall) {
        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName, .email]
        if let nonce = call.getString("nonce"), !nonce.isEmpty {
            request.nonce = nonce
        }
        pendingCall?.reject("Superseded by a new sign-in request", "SUPERSEDED")
        pendingCall = call

        DispatchQueue.main.async {
            let controller = ASAuthorizationController(authorizationRequests: [request])
            controller.delegate = self
            controller.presentationContextProvider = self
            controller.performRequests()
        }
    }

    public func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return bridge?.webView?.window ?? ASPresentationAnchor()
    }

    public func authorizationController(controller: ASAuthorizationController,
                                        didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let call = pendingCall else { return }
        pendingCall = nil

        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
              let tokenData = credential.identityToken,
              let identityToken = String(data: tokenData, encoding: .utf8),
              let codeData = credential.authorizationCode,
              let authorizationCode = String(data: codeData, encoding: .utf8) else {
            call.reject("Apple did not return a credential", "NO_CREDENTIAL")
            return
        }

        var result: [String: Any] = [
            "user": credential.user,
            "identityToken": identityToken,
            "authorizationCode": authorizationCode
        ]
        // Apple sends the email and name only on the first sign-in
        if let email = credential.email { result["email"] = email }
        if let given = credential.fullName?.givenName { result["givenName"] = given }
        if let family = credential.fullName?.familyName { result["familyName"] = family }
        call.resolve(result)
    }

    public func authorizationController(controller: ASAuthorizationController,
                                        didCompleteWithError error: Error) {
        guard let call = pendingCall else { return }
        pendingCall = nil
        if let authError = error as? ASAuthorizationError, authError.code == .canceled {
            call.reject("Sign-in was cancelled", "CANCELED")
        } else {
            call.reject(error.localizedDescription, "FAILED")
        }
    }
}
