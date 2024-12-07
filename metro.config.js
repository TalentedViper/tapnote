const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
// const config = {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     },
//     resolver: {
//       assetExts: assetExts.filter(ext => ext !== 'svg'), // Remove svg from assetExts
//       sourceExts: [...sourceExts, 'svg'], // Add svg to sourceExts
//     },
//   };

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);