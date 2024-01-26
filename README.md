## How To Use

```bash
# Install dependencies
$ npm install

# Start the local development server (on port 8080)
$ npm run local

# Ready for production?
# Build the production ready code to the /dist folder
$ npm run build
```

## Third Party Documentation

Phaser:

-   https://rexrainbow.github.io/phaser3-rex-notes/docs/site/
-   https://photonstorm.github.io/phaser3-docs/


## Code structure

All assets need to be inside the **/src/assets** folder.
All game code lies inside the **/src/scripts** folder.

The code is divided into two parts:
**/src/engine/** - this part is responsible for physics.
In the current implementation, physics works inside the WebWorker, this is done in order to minimize losses during multiple calculations.

**/src/game/** - this part is responsible for the visual part.
The structure of this part should be familiar to you, inside you will see the scene files as well as additional accompanying code.

## Resources

All resources are stored in the **/src/assets** folder. At build time, the **/src/assets** folder is copied directly to **/dist**.
The configuration file for the game is located: **/src/configs**
Top-level property like "image, spine, audio, aseprite" are the type name and are used by the Phaser loader, do not change the names of these property and objects in any case, otherwise the load will break.


### Questions

-   I have added several spine files but only one of them works correctly.

Please make sure that the files you added have different names. This is important even if they are in different folders.

-   I added new spine animations and the game broke.

Most likely you made a mistake with the spine version, all animations must be exported from version 3.8

## PWA

At the moment it is active for playing offline. All PWA configs are in the **pwa** folder.

## Webpack

All webpack configs are in the **webpack** folder.
