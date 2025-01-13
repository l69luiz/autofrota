import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material";
import React from "react"

interface IBarraDeFerramentasProps {
    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    aoMudarTextoDeBusca?: (novoTexto: string) => void;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoClicarEmNovo?: () => void;


}

export const BarraDeFerramentas: React.FC<IBarraDeFerramentasProps> = ({
    textoDaBusca = '',
    mostrarInputBusca= false,
    aoMudarTextoDeBusca,
    textoBotaoNovo ='Novo',
    mostrarBotaoNovo=true,
    aoClicarEmNovo,


}) => {
    const theme = useTheme();

    return (
        <Box
            gap={1}
            marginX={1}
            padding={1}
            paddingX={2}
            display='flex'
            alignItems='center'
            height={theme.spacing(5)}
            component={Paper}>

            {mostrarInputBusca &&(
                <TextField
                size='small'
                value={textoDaBusca}
                onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
                placeholder="Pesquisar"
            />
            )}
            
            {mostrarBotaoNovo && (
                <Box flex={1} display='flex' justifyContent='end'>
                <Button
                variant='contained'
                disableElevation
                color='primary'
                endIcon={<Icon>add</Icon>}
                onClick={aoClicarEmNovo}
                >{textoBotaoNovo}</Button>
            </Box>

            )}
        </Box>

    );

}