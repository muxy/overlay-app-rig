# Twitch Policies and Guidelines

Twitch enforces certain policies when it comes to your app's code and styling. The essentials are
reproduced here, however Twitch has the ability to reject any app they deem as against their
development guidelines.

## General Guidelines
 - Do not use eval() statements.
 - Whenever possible, put all text in the ​html templates. When you substitute words in a dynamic
   string, enumerate the dynamic strings in the JS code when possible.
 - Do not inject AJAX requested data directly into the DOM.
 - The following browsers are supported:
   - IE11 (Windows)
   - 2 most recent versions of Chrome (OS X and Windows)
   - 2 most recent versions of Firefox (OS X and Windows)
   - Safari 9 (OS X)

## Internationalization
Developers are responsible for localizing their product front ends appropriately.

## Extension Content Policies
Twitch's content policies are still being finalized, however they have given the following
allowances and limitations:
 - Extensions are allowed to charge broadcasters for additional or premium functionality.
 - Extensions are allowed to facilitate direct value transfer between viewers and broadcasters.
 - Any value exchange between a viewer and developer must be pre-approved by Twitch.
 - Advertising:
   - No dynamic advertising content is to be displayed in a video player overlay.
   - Static advertising content (sponsors, merchandise, and so on) must be pre-approved by
     Twitch, to have external links whitelisted.
 - Extensions may not encourage or facilitate users to break Twitch user terms of
   service, including:
   - No sexually explicit content.
   - No encouragement of violence, bullying, or hate speech.
   - No deceptive behavior or impersonation.
   - No facilitation of illegal activities.
 - Extensions may not use keyboard hotkeys to power functionality.
 - Extensions may not send audio to the end user.
 - Extensions may not include anything intentionally malicious, designed to circumvent Twitch
   security or safety precautions.
 - Extensions must respect intellectual property rights. The extension developer is responsible
   for any claims filed against intellectual property displayed by an extension. An extension
   may be removed until such claims are resolved.
 - Extensions may not use irrelevant, misleading, or excessive keywords in titles, descriptions,
   or metadata.
 - An extension listing must accurately and completely describe the functionality of the extension.
 - Do not try to manipulate placement within the discovery portal.
 - Twitch reserves the right to remove from the extension ecosystem any extension, for any reason,
   at any time.

## Next Steps
 - [App Configuration](AppConfiguration.md)
 - [App Structure](AppStructure.md)
 - [App Appearance](AppAppearance.md)
 - [App Behavior](AppBehavior.md)
 - [Server-Sent Data](ServerSentData.md)
 - [Game-Sent Data](GameSentData.md)
 - [Twitch Policies and Guidelines](TwitchPolicies.md)
