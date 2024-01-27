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

Phaser Editor 2d:

-   https://help-v3.phasereditor2d.com/

Esoteric Software - Spine:

-   https://ru.esotericsoftware.com/spine-phaser

## Structure

-   All assets need to be inside the **/static/assets** folder.
-   All game code lies inside the **/src/scripts/game** folder.
-   All webworker code lies inside the **/src/scripts/engine** folder.

### Code

The code is divided into two parts:

**/src/scripts/engine** - This part is responsible for running heavy and low-performance code, such as physics. It runs inside the WebWorker, this is done in order to minimize losses during multiple calculations.

**/src/scripts/game** - The structure of this part should be familiar to you, inside you will see the scene files as well as additional accompanying code.

### Resources

All resources are stored in the **/static/assets** folder.

At build time, the **/src/assets** folder is copied directly to **/dist**.

The configuration file is assembled using the editor. In case of loading fonts, please use the 'binary' type and also make sure that you have specified the font extension in the key. See the example of loading the 'Uni_Sans_Heavy.otf' font.

### Questions

-   I have added several spine files but only one of them works correctly.

Please make sure that the files you added have different names. This is important even if they are in different folders.

-   I added new spine animations and the game broke.

Most likely you made a mistake with the spine version, all animations must be exported from version 4.1

## PWA

At the moment it is active for playing offline. All PWA configs are in the **pwa** folder.

## Webpack

All webpack configs are in the **webpack** folder.
