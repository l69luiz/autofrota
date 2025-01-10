//import { createTheme } from '@mui/material';
import { blue, cyan, green, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';


export const DarkTheme = createTheme({
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
        default: '#202124',
        paper: '#303134' ,
        
    }

}

})