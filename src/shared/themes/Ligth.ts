import { createTheme } from '@mui/material';
import { blue, cyan, green, yellow } from '@mui/material/colors';

export const LightTheme = createTheme({
palette: {
    primary:{
        main: blue [700],
        dark: blue [800] ,
        light: blue [500],
        contrastText: '#ffffff',

    },
    secondary:{
        main: cyan [500],
        dark: cyan [800] ,
        light: cyan [500],
        contrastText: '#ffffff',

    },
    background:{
        default: '#ffffff',
        paper: '#f7f6f3' ,
        
    }

}

})