2.x.x / WIP
------------------

- Updated CM spec conformance to v0.13 (partially).
- Added 'zero' preset.
- Fixed block termination check when rules are disabled.


2.1.3 / 2014-12-24
------------------

- Added curring to `set`/`configure`/`enable`/`disable` methods.
- Demo rework - now can include plugins.
- Docs update.


2.1.2 / 2014-12-23
------------------

- Exposed helpers into parser instances (for plugins).
- Removed utils from global export - been in instances seems enougth.
- Refactored demo & added markdown-it-emoji to it.


2.1.1 / 2014-12-22
------------------

- Refreshed browser builds, missed in prev release.
- Minor changes.


2.1.0 / 2014-12-21
------------------

- Separated method to enable rules by whitelist (enableOnly).
- Changed second param of enable/disable ruler methods.
- Shortcuts in main class for bulk enable/disable rules.
- ASCII-friendly browserified files.
- Separate package for spec tests.


2.0.0 / 2014-12-20
------------------

- New project name & home! Now it's `markdown-it`,
- Sugar for constructor call - `new` is not mandatory now.
- Renamed presets folder (configs -> presets).
