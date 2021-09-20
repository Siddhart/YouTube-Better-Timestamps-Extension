{
    "name": "Youtube Time Remaining",
    "description": "Click on the timestamp to see how much time there is remaining",
    "version": "1.0",
    "manifest_version": 3,
    "content_scripts": [
        {
            "css": [
                "popup.css"
            ],
            "js": [
                "background.js"
            ],
            "matches": [
                "https://www.youtu.be/*",
                "https://www.youtube.com/*"
            ]
        }
    ],
    "commands": {
        "toggle-feature-foo": {
            "suggested_key": {
                "default": "Ctrl+Shift+9"
            },
            "description": "Toggle feature foo",
            "global": true
        }
    }
}