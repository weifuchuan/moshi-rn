import React from 'react';
import { SCREEN_WIDTH } from '../kit/index';
import { colors } from '../../loadGlobalProps';

export const defaultThemes = Object.freeze({
  distances: {
    drawerWidth: SCREEN_WIDTH * 0.75
  },
  colors
});

const ThemeContext = React.createContext(defaultThemes);

export default ThemeContext;
