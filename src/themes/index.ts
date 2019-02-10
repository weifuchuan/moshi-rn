import React from 'react';
import { SCREEN_WIDTH } from '../kit/index';

export const defaultThemes = {
  colors: {
    BACKGROUND: '#EAEAEF',
    ICON_BLUE: '#2196f3',
    LOADING_BLUE: '#6A5ACD'
  },
  distances: {
    drawerWidth: SCREEN_WIDTH * 0.75
  }
};

const ThemeContext = React.createContext(defaultThemes);

export default ThemeContext;
