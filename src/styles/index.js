/**
 * @flow
 */

import { Dimensions, Platform } from 'react-native';
import colors from './colors'; // Ensure this file exports a colors object
import fonts from './fonts';   // Ensure this file exports a fonts object

const { width } = Dimensions.get('window');

// Define your rounded styles
const rounded = {
  xl: 30,
  lg: 16,
  md: 15,
  sm: 5,
};

// You might want to include some common styles here
const commonStyles = {
  text: {
    fontSize: 16,
    color: colors.text, // Assuming you have a text color defined
    fontFamily: fonts.regular, // Assuming you have a regular font defined
  },
  box_show: {
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 0,
        elevation: 3,
      },
    }),
  },
};

// Add any additional styles you may need
const typography = {
  // h1: {
  //   fontSize: 28,
  //   fontFamily: fonts.bold, // Assuming you have a bold font defined
  //   lineHeight: 34,
  //   color: colors.primary, // Assuming you have a primary color defined
  // },
  
  boldH1: {
    fontFamily: 'Poppins',
    fontSize:24,
    lineHeight:36,
  },
  h1:{
    fontFamily: 'Poppins',
    fontSize: 24,
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'Poppins',
    fontSize:22,
    lineHeight:33,
  },
  h3: {
    fontFamily: 'Poppins',
    fontSize:20,
    lineHeight:30,
  },
  h4:{
    fontFamily: 'Poppins',
    fontSize:18,
    lineHeight:27,
  },
  h5: {
    fontFamily: 'Poppins',
    fontSize:16,
    lineHeight:24,
  },
  h6: {
    fontFamily: 'Poppins',
    fontSize:14,
    lineHeight:21,
  },
  h7: {
    fontFamily: 'Poppins',
    fontSize:12,
    lineHeight:18,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  subtext: {
    fontFamily: 'Poppins',
    fontSize:10,
    lineHeight:15,
  },
  weight_3: {
    fontWeight: '300',
  },
  weight_4: {
    fontWeight: '400',
  },
  weight_5:{
    fontWeight: '500',
  },
  weight_6:{
    fontWeight: '600',
  },
  bold: {
    fontWeight: 'bold',
  },
  extraBold: {
    fontWeight: '800',
  },
  baseline: {
    fontFamily:'Poppins',
    fontSize:14,
    lineHeight:22,
  }
};


// Exporting everything together
export { colors, fonts, rounded, commonStyles, typography };
